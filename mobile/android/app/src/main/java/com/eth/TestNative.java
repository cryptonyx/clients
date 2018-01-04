package com.eth;

import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import org.ethereum.geth.*;
import org.json.JSONArray;
import org.json.JSONObject;

import android.content.SharedPreferences;
import android.os.Environment;
import android.util.*;
import android.util.Log;
import android.widget.Toast;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.IOException;
import java.math.BigDecimal;
import java.math.BigInteger;
import java.util.Timer;
import java.util.TimerTask;

public class TestNative extends ReactContextBaseJavaModule {

    private long lastBlock;
    private Timer timer;
    private TimerTask timerTask = new TimerTask() {

        @Override
        public void run() {
            PeerInfos pi = NodeHolder.getInstance().getNode().getPeersInfo();
            getReactApplicationContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit("peersUpdate", ""+pi.size());
            getReactApplicationContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit("blocksUpdate", "" + lastBlock);
        }
    };

    public TestNative(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "TestNative";
    }


    @ReactMethod
    public void subscribeForPeerCount(){
        if(timer==null) {
            // use timer variable as one time initialization guard
            try {
                Geth.setVerbosity(4);


            Enodes bootstrap = new Enodes(1);
            Enode mainBootstrap = Geth.newEnode(
                    "enode://5ef73f5af5c3178dc8939d1a8dee4450cb3b1c06cff112ea5d55dc3e9351c083088db1625229ba64144854de1e2b6b1b940eb7621b63a8af0a761a0df79ce9f7@85.25.34.76:30303?discport=30304");
            bootstrap.set(0, mainBootstrap);


                NodeConfig nc = new NodeConfig();
                nc.setBootstrapNodes(bootstrap);
                nc.setEthereumNetworkID(3);
                nc.setEthereumGenesis(Geth.testnetGenesis());
//                nc.setEthereumNetworkID(15);
//                nc.setEthereumGenesis("{\n" +
//                        "    \"config\": {\n" +
//                        "        \"chainId\": 15,\n" +
//                        "        \"homesteadBlock\": 0,\n" +
//                        "        \"eip155Block\": 0,\n" +
//                        "        \"eip158Block\": 0\n" +
//                        "    },\n" +
//                        "    \"difficulty\": \"400000\",\n" +
//                        "    \"gasLimit\": \"210000\",\n" +
//                        "    \"alloc\": {\n" +
//                        "        \"36e5f859479ff980fe39d1490a158b2c89600043\": { \"balance\": \"300000000000000000000\" },\n" +
//                        "        \"906d9a0de55ab73b64e2a29c3fc0b536160813d6\": { \"balance\": \"400000000000000000000\" }\n" +
//                        "    }\n" +
//                        "}");
                nc.setEthereumEnabled(true);

                Node node = Geth.newNode(getReactApplicationContext().getFilesDir() + "/.eth1", nc);
                node.start();

                NodeHolder nh = NodeHolder.getInstance();
                nh.setNode(node);

                KeyStore ks = new KeyStore(getReactApplicationContext().getFilesDir() + "/keystore", Geth.LightScryptN, Geth.LightScryptP);
                Accounts accs = ks.getAccounts();

                long accs_sz = accs.size();
                for (int i = 0; i < accs_sz; i++) {
                    Account a = accs.get(i);
                    android.util.Log.d("+++ ETHAPP +++", " account: " + a.getAddress().getHex());
                }
                nh.setKs(ks);
                Account newAcc = ks.getAccounts().get(0);
                android.util.Log.d("keyfile", newAcc.getAddress().getHex());
                nh.setAcc(newAcc);
                Log.d("success", "this worked");
            } catch (Exception e) {
                Log.d("fail", "what happened?" + e.getMessage());
                e.printStackTrace();
            }





//            timer = new Timer();
//            timer.scheduleAtFixedRate(timerTask, 0, 10000);
        }
    }

    @ReactMethod
    public void subscribeForNewBlocks() {
        KeyStore ks = NodeHolder.getInstance().getKs();
        EthereumClient ethereumClient = null;
        try {
            ethereumClient = NodeHolder.getInstance().getNode().getEthereumClient();

            NewHeadHandler handler = new NewHeadHandler() {
                @Override public void onError(String error) { }
                @Override public void onNewHead(final Header header) {
                    lastBlock = header.getNumber();

                    SharedPreferences preferences = getReactApplicationContext().getSharedPreferences("MyPreferences", ReactApplicationContext.MODE_PRIVATE);
                    SharedPreferences.Editor editor = preferences.edit();
                    editor.putLong("lastBlock", header.getNumber());
                    editor.commit();
                }
            };
            ethereumClient.subscribeNewHead(Geth.newContext(), handler,  16);

        } catch (Exception e) {

        }
    }

    @ReactMethod
    public void getAccounts(Callback cb) throws Exception {
        KeyStore ks = NodeHolder.getInstance().getKs();
        EthereumClient ethereumClient = NodeHolder.getInstance().getNode().getEthereumClient();
        Context ctx = new Context();
        JSONArray ar = new JSONArray();


        long savedBlock = getReactApplicationContext().getSharedPreferences("MyPreferences", ReactApplicationContext.MODE_PRIVATE).getLong("lastBlock", -1);

        if(savedBlock > 0) {
            getReactApplicationContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit("blocksUpdate", "" + savedBlock);
            lastBlock = savedBlock;
        }

        for (int i = 0; i < ks.getAccounts().size(); i++)
        {
            Account newAcc = ks.getAccounts().get(i);
            JSONObject j = new JSONObject();
            j.put("account", newAcc.getAddress().getHex());
            try {
                BigInt a = ethereumClient.getBalanceAt(ctx, newAcc.getAddress(), savedBlock);
                BigDecimal amount = Convert.fromWei(a.toString(), Convert.Unit.ETHER);
                j.put("amount", amount.toPlainString());
            }catch (Exception e) {
                j.put("amount", "0");
                e.printStackTrace();
            }
            ar.put(j);
        }
        JSONObject jo2 = new JSONObject();
        jo2.put("accounts", ar);
        cb.invoke(jo2.toString());
    }

    @ReactMethod
    public void addKey(String path, String pass1, String pass2, Callback cb) {
//        Toast.makeText(getReactApplicationContext(), "processing...", Toast.LENGTH_LONG);

        File f = new File(path);
        boolean rprm = f.canRead();
        if(rprm) {
            int size = (int) f.length();
            byte[] bytes = new byte[size];
            try {
                BufferedInputStream buf = new BufferedInputStream(new FileInputStream(f));
                buf.read(bytes, 0, bytes.length);
                buf.close();

                NodeHolder nh = NodeHolder.getInstance();
                KeyStore ks = nh.getKs();

                Account a = ks.importKey(bytes, pass1, pass2);

                cb.invoke("Success! Imported account: " + a.getAddress().getHex());
            } catch (Exception e) {
                e.printStackTrace();
                cb.invoke("Error: " + e.getLocalizedMessage());
            }
        }
    }


    @ReactMethod
    public void removeKey(String address, String pass1, Callback cb) {
        try {
            NodeHolder nh = NodeHolder.getInstance();
            KeyStore ks = nh.getKs();

            Account a = null;
            Accounts accs = ks.getAccounts();
            for (int i = 0; i < accs.size(); i++) {
                Account newAcc = accs.get(i);
                String hex = newAcc.getAddress().getHex();
                if (hex.equalsIgnoreCase(address)) {
                    ks.deleteAccount(newAcc, pass1);
                    break;
                }
            }

            android.util.Log.d("*** _ACCOUNT deleted: ", address);
            cb.invoke("Success! Account deleted");
        } catch (Exception e) {
            e.printStackTrace();
            cb.invoke("Error: " + e.getLocalizedMessage());
        }

    }
        @ReactMethod
    public void exportKey(String address, String pass1, String pass2, Callback cb) {
        try {
            NodeHolder nh = NodeHolder.getInstance();
            KeyStore ks = nh.getKs();

            Account a = null;
            Accounts accs = ks.getAccounts();
            for (int i = 0; i < accs.size(); i++)
            {
                Account newAcc = accs.get(i);
                String hex = newAcc.getAddress().getHex();
                if(hex.equalsIgnoreCase(address)) {
                    a = newAcc;
                    break;
                }
            }


            byte[] fileBytes = ks.exportKey(a, pass1, pass2);
            String downloadDirectory = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS).getAbsolutePath() + "/ETH+" + address + ".key";
            BufferedOutputStream bos = new BufferedOutputStream(new FileOutputStream(downloadDirectory));
            bos.write(fileBytes);
            bos.flush();
            bos.close();

            android.util.Log.d("*** _ACCOUNT exported: ", downloadDirectory);
            cb.invoke("Success! Exported to path: " + downloadDirectory);
        } catch (Exception e) {
            e.printStackTrace();
            cb.invoke("Error: " + e.getLocalizedMessage());
        }
    }

    @ReactMethod
    public void createKey(String pass1, Callback cb) {
        try {
            NodeHolder nh = NodeHolder.getInstance();
            KeyStore ks = nh.getKs();

            Account newAcc = ks.newAccount(pass1);

            android.util.Log.d("*** _ACCOUNT CREATED: ", newAcc.getAddress().getHex());
            cb.invoke("Success! Imported account: " + newAcc.getAddress().getHex());
        } catch (Exception e) {
            e.printStackTrace();
            cb.invoke("Error: " + e.getLocalizedMessage());
        }
    }

    @ReactMethod
    public void sendEther(String from, String to, String gas, String pass1, String howMuch, Callback cb) {
            NodeHolder nh = NodeHolder.getInstance();
            KeyStore ks = nh.getKs();

        try {
//                Toast.makeText(getReactApplicationContext(), "processing...", Toast.LENGTH_LONG);

                BigDecimal amount = Convert.toWei(howMuch, Convert.Unit.ETHER);
                BigInt value = Geth.newBigInt(0);
                value.setString(amount.toString(), 10);
                BigInt gasLimit = Geth.newBigInt(0);
                gasLimit.setString(gas, 10);

                EthereumClient ethereumClient = nh.getNode().getEthereumClient();
                Context ctx = new Context();
                BigInt gasPrice = ethereumClient.suggestGasPrice(ctx);


                long nonce = ethereumClient.getPendingNonceAt(ctx, Geth.newAddressFromHex(from)); // 1. Blocks the Thread if used? Syncing maybe?

                Transaction transaction = Geth.newTransaction(nonce, Geth.newAddressFromHex(to), value, gasLimit, gasPrice, howMuch.getBytes());

                Account a_from = null;
                Accounts accs = ks.getAccounts();
                for (int i = 0; i < accs.size(); i++)
                {
                    Account newAcc = accs.get(i);
                    String hex = newAcc.getAddress().getHex();
                    if(hex.equalsIgnoreCase(from)) {
                        a_from = newAcc;
                        break;
                    }
                }
                ks.timedUnlock(a_from, pass1, 10000000);

                transaction = ks.signTx(a_from, transaction, null); // 2. Why BigInt needed?

//                android.util.Log.d("", "Cost: " + transaction.getCost());
//                android.util.Log.d("", "GasPrice: " + transaction.getGasPrice());
//                android.util.Log.d("", "Gas: " + transaction.getGas());
//                android.util.Log.d("", "Nonce: " + transaction.getNonce());
//                android.util.Log.d("", "Value: " + transaction.getValue());
//                android.util.Log.d("", "Sig-Hash Hex: " + transaction.getSigHash().getHex());
//                android.util.Log.d("", "Hash Hex: " + transaction.getHash().getHex());
//                android.util.Log.d("", "Data-Length: " + transaction.getData().length);
//                android.util.Log.d("", "To: " + transaction.getTo().getHex());
//                android.util.Log.d("", "Sender: " + transaction.getFrom(new BigInt(0)).getHex());

                ethereumClient.sendTransaction(ctx, transaction);
                cb.invoke("Success! TxHash: \n" + transaction.getSigHash().getHex());
        } catch (Exception e) {
            e.printStackTrace();
            cb.invoke("Error: " + e.getLocalizedMessage());
        }
}

    @ReactMethod
    public void test(String message, Callback cb) {
        try {
            NodeHolder nh = NodeHolder.getInstance();
            Node node = nh.getNode();
            Context ctx = new Context();
            if (node != null) {
                NodeInfo info = node.getNodeInfo();
                PeerInfos pi = node.getPeersInfo();
                for(int i = 0; i < pi.size(); i++) {
                   String ra = pi.get(i).getRemoteAddress();
                    String rid = pi.get(i).getID();
                    android.util.Log.d("*** _REMOTE_PEER", "PEER: " + ra + " " + rid);
                }

                EthereumClient ethereumClient = node.getEthereumClient();



                final String address_string = "0x5070832E17e2042754ccD86F28B9d21FcB0E1567";
                String abi = "\n" +
                        "[{\"constant\":false,\"inputs\":[{\"name\":\"to\",\"type\":\"address\"},{\"name\":\"etherAmount\",\"type\":\"uint256\"},{\"name\":\"_txHash\",\"type\":\"string\"}],\"name\":\"buyAlt\",\"outputs\":[],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"constant\":false,\"inputs\":[{\"name\":\"_robot\",\"type\":\"address\"}],\"name\":\"setRobot\",\"outputs\":[],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[],\"name\":\"isOpen\",\"outputs\":[{\"name\":\"\",\"type\":\"bool\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[{\"name\":\"totalSupply\",\"type\":\"uint256\"}],\"name\":\"getBonus\",\"outputs\":[{\"name\":\"\",\"type\":\"uint256\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":false,\"inputs\":[],\"name\":\"finalize\",\"outputs\":[],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[],\"name\":\"getCurrentBonus\",\"outputs\":[{\"name\":\"\",\"type\":\"uint256\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":false,\"inputs\":[{\"name\":\"_authority\",\"type\":\"address\"}],\"name\":\"setAuthority\",\"outputs\":[],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[{\"name\":\"etherVal\",\"type\":\"uint256\"}],\"name\":\"getTokensAmount\",\"outputs\":[{\"name\":\"\",\"type\":\"uint256\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[],\"name\":\"owner\",\"outputs\":[{\"name\":\"\",\"type\":\"address\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":false,\"inputs\":[{\"name\":\"etherPerTie\",\"type\":\"uint256\"}],\"name\":\"setPrice\",\"outputs\":[],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[],\"name\":\"price\",\"outputs\":[{\"name\":\"\",\"type\":\"uint256\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":false,\"inputs\":[{\"name\":\"open\",\"type\":\"bool\"}],\"name\":\"open\",\"outputs\":[],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"constant\":false,\"inputs\":[{\"name\":\"to\",\"type\":\"address\"}],\"name\":\"buy\",\"outputs\":[],\"payable\":true,\"stateMutability\":\"payable\",\"type\":\"function\"},{\"constant\":false,\"inputs\":[{\"name\":\"newOwner\",\"type\":\"address\"}],\"name\":\"transferOwnership\",\"outputs\":[],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[],\"name\":\"token\",\"outputs\":[{\"name\":\"\",\"type\":\"address\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"name\":\"_token\",\"type\":\"address\"},{\"name\":\"_multisig\",\"type\":\"address\"},{\"name\":\"_authority\",\"type\":\"address\"},{\"name\":\"_robot\",\"type\":\"address\"}],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"constructor\"},{\"payable\":true,\"stateMutability\":\"payable\",\"type\":\"fallback\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"name\":\"holder\",\"type\":\"address\"},{\"indexed\":false,\"name\":\"tokens\",\"type\":\"uint256\"},{\"indexed\":false,\"name\":\"txHash\",\"type\":\"string\"}],\"name\":\"AltBuy\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"name\":\"holder\",\"type\":\"address\"},{\"indexed\":false,\"name\":\"tokens\",\"type\":\"uint256\"}],\"name\":\"Buy\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[],\"name\":\"RunSale\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[],\"name\":\"PauseSale\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[],\"name\":\"FinishSale\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"name\":\"weiPerTIE\",\"type\":\"uint256\"}],\"name\":\"PriceSet\",\"type\":\"event\"}]" +
                        "}]";
                Address address = Geth.newAddressFromHex(address_string);
                BoundContract contract = Geth.bindContract(address, abi, ethereumClient);
                CallOpts callOpts = Geth.newCallOpts();
                callOpts.setContext(ctx);
//                callOpts.setGasLimit(31500);
//                System.out.println("OUTPUT: " + getString(contract, callOpts));

//Setter String to Test Contract
//                Interfaces params = Geth.newInterfaces(1);
//                Interface anInterface = Geth.newInterface();
//                anInterface.setString(teststring);
//                params.set(0,anInterface);
//                return contract.transact(opts, "set_s", params);

//Getter String from Test Contract
                Interfaces args = Geth.newInterfaces(0);
                Interface address_param = Geth.newInterface();
                address_param.setAddress(Geth.newAddressFromHex("0xb5895ae4a9bdb49cd17bda4b81717551a55dae78"));
//                args.set(0, address_param);
                Interfaces results = Geth.newInterfaces(2);
                Interface result = Geth.newInterface();
                result.setDefaultString();
                results.set(0, result);
                results.set(1, result);
                contract.call(callOpts, results, "getCurrentBonus", args);
                String string = results.get(0).getString();
                System.out.println("OUTPUT: " + string);

//                BigInt value = Geth.newBigInt(1);
//                BigInt gasLimit = Geth.newBigInt(50000);
//                BigInt gasPrice = ethereumClient.suggestGasPrice(ctx);
//                String testData = "Hello World";
//                byte[] data = testData.getBytes();
//                Account newAcc = nh.getAcc();
//
//                BigInt balanceAt = ethereumClient.getBalanceAt(ctx, newAcc.getAddress(), -1);
//                android.util.Log.d("_ETHER BALANCE", "*** ETHER BALANCE 1 " + balanceAt.toString() + " " + newAcc.getAddress().getHex());
//                balanceAt = ethereumClient.getBalanceAt(ctx, new Address("0x753e05802ec3e222a1dd4520536059cfe50e50b2"), -1);
//                cb.invoke("*** ETHER BALANCE " + balanceAt.toString() + " " + newAcc.getAddress().getHex());
//                android.util.Log.d("_ETHER BALANCE", "*** ETHER BALANCE 2 " + balanceAt.toString() + " 0x753e05802ec3e222a1dd4520536059cfe50e50b2");
//

//                long nonce = ethereumClient.getPendingNonceAt(ctx, newAcc.getAddress()); // 1. Blocks the Thread if used? Syncing maybe?

//                Transaction transaction = Geth.newTransaction(nonce, new Address("753e05802ec3e222a1dd4520536059cfe50e50b2"), value, gasLimit, gasPrice, data);

//                nh.getKs().timedUnlock(newAcc, "!3351aa99", 10000000);
//                transaction = nh.getKs().signTx(newAcc, transaction, null); // 2. Why BigInt needed?

//                android.util.Log.d("", "Cost: " + transaction.getCost());
//                android.util.Log.d("", "GasPrice: " + transaction.getGasPrice());
//                android.util.Log.d("", "Gas: " + transaction.getGas());
//                android.util.Log.d("", "Nonce: " + transaction.getNonce());
//                android.util.Log.d("", "Value: " + transaction.getValue());
//                android.util.Log.d("", "Sig-Hash Hex: " + transaction.getSigHash().getHex());
//                android.util.Log.d("", "Hash Hex: " + transaction.getHash().getHex());
//                android.util.Log.d("", "Data-Length: " + transaction.getData().length);
//                android.util.Log.d("", "To: " + transaction.getTo().getHex());
//                android.util.Log.d("", "Sender: " + transaction.getFrom(new BigInt(0)).getHex());

//                ethereumClient.sendTransaction(ctx, transaction);

//                return;
            }
            cb.invoke("node was null");
        } catch (Exception e) {
            android.util.Log.d("", e.getMessage());
            e.printStackTrace();
        }
    }
}