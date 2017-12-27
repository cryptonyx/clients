package com.eth;

import java.io.File;
import android.os.Bundle;
import android.util.Log;

import com.facebook.react.ReactActivity;

import org.ethereum.geth.Account;
import org.ethereum.geth.Accounts;
import org.ethereum.geth.Enode;
import org.ethereum.geth.Enodes;
import org.ethereum.geth.Geth;
import org.ethereum.geth.KeyStore;
import org.ethereum.geth.Node;
import org.ethereum.geth.NodeConfig;

public class MainActivity extends ReactActivity {

//    private String keyfile = "{\"address\":\"B5895AE4a9BDB49cD17bda4B81717551A55DaE78\",\"crypto\":{\"cipher\":\"aes-128-ctr\",\"ciphertext\":\"9111c04efc353eff245ccb7033bbbd01c5ee5da96b657505c8d68677067af044\",\"cipherparams\":{\"iv\":\"6282b3bf1b1d077cd84c853a8861189d\"},\"kdf\":\"scrypt\",\"kdfparams\":{\"dklen\":32,\"n\":4096,\"p\":6,\"r\":8,\"salt\":\"20d323a2b276a660888e378ecb5f81b01bdbe902def6575c57c0c4db4fd064f9\"},\"mac\":\"7fda57c3954594ddd90d8b1e45a70012a3834fe47c38dee114abd531a3e1ad48\"},\"id\":\"348714cf-9457-4fb9-83e8-cffa259a55d8\",\"version\":3}";
    private String keyfile = "{\"address\":\"b5895ae4a9bdb49cd17bda4b81717551a55dae78\",\"id\":\"840822ef-42e7-47f2-80e0-95e87d016664\",\"version\":3,\"crypto\":{\"cipher\":\"aes-128-ctr\",\"cipherparams\":{\"iv\":\"09218109a33158ddef9f7bc9de9b1c50\"},\"ciphertext\":\"73006aabe6c447e6c9f962838eb293411197f052a313615e7bdd0dd635c8a721\",\"kdf\":\"scrypt\",\"kdfparams\":{\"dklen\":32,\"n\":262144,\"p\":1,\"r\":8,\"salt\":\"2fe0c40852ae391c410c4ba59909e467518eb3796ad2332e8262424db451ca01\"},\"mac\":\"511f7faba4fed26c3c3bf82e0ce91ec767a11d84f70744e29872864ea2598f09\"},\"key_name\":\"\",\"nonce\":0}";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "Eth";
    }
}
