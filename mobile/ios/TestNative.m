//
//  RNEthController.m
//  Eth
//
//  Created by User on 04.01.18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import "TestNative.h"
#import <React/RCTLog.h>

@implementation TestNative
bool nodeInitialized = false;
GethContext* gCtx;
GethNode* node;
GethAccount* acc;
GethKeyStore* ks;
long long lastBlock = 0;


// To export a module named CalendarManager
RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(subscribeForPeerCount)
{
  [self initEth];
}


#pragma - GethNewHeadHandler implementation
- (void)onError:(NSString*)failure {
  RCTLogInfo(@"*** error getting new header: %@", failure);
}

- (void)onNewHead:(GethHeader*)header {
  lastBlock = [header getNumber];
  [[NSUserDefaults new] setObject:[NSNumber numberWithLongLong:lastBlock] forKey:@"MyPreferences"];
}


RCT_EXPORT_METHOD(subscribeForNewBlocks)
{
  NSError *e;
  GethEthereumClient* ethereumClient;
  
  @try {
    ethereumClient = [node getEthereumClient:&e];
    gCtx = GethNewContext();
    [ethereumClient subscribeNewHead:gCtx handler:self buffer:100000 error:&e];
  } @catch (NSException *exception) {
    RCTLogError(@"*** subscribe head exception %@", exception);
  }
}


RCT_EXPORT_METHOD(getAccounts:(RCTResponseSenderBlock)callback)
{
  
  // TODO:
  callback(@[@"{\"accounts\": []}"]);
  return;
  
  NSError *e;
  GethEthereumClient* ethereumClient = [node getEthereumClient:&e];
  long long savedBlock = [[[NSUserDefaults new] objectForKey:@"MyPreferences"] longLongValue];
  if(savedBlock > 0)
  {
    [self sendEventWithName:@"blocksUpdate" body:[NSString stringWithFormat:@"%lld",savedBlock]];
    lastBlock = savedBlock;
  }
  NSMutableArray* ar = [NSMutableArray new];
  for(int i = 0; i < [[ks getAccounts] size]; i++)
  {
    GethAccount* newAcc = [[ks getAccounts] get:i error:&e];
    NSMutableDictionary* j = [NSMutableDictionary dictionaryWithObjectsAndKeys:[[newAcc getAddress] getHex], @"account", nil];
    GethBigInt* a = [ethereumClient getBalanceAt:gCtx account:[newAcc getAddress] number:savedBlock error:&e];
    [j setObject:[a string] forKey:@"amount"];
    
    [ar addObject:j];
  }
  
  NSDictionary* jo2 = [NSDictionary dictionaryWithObjectsAndKeys:ar, @"accounts", nil];
  
  NSData *jsonData = [NSJSONSerialization dataWithJSONObject:jo2 options:0 error:&e];
  
  if (!jsonData) {
    RCTLogInfo(@"Got an error: %@", e);
  } else {
    NSString *jsonString = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
    callback(@[jsonString]);
  }
}



RCT_EXPORT_METHOD(addKey:(NSString*)path pass1:(NSString*)pass1 pass2:(NSString*)pass2 callback:(RCTResponseSenderBlock)callback)
{
  NSError *e;
  NSURL *url = [NSURL fileURLWithPath:path];
  NSData *d = [NSData dataWithContentsOfURL:url];
  GethAccount* a = [ks importKey:d passphrase:pass1 newPassphrase:pass2 error:&e];
  if(e)
    RCTLogError(@"*** error reading data: %@", e);
  else
    callback(@[[NSString stringWithFormat:@"Success! Imported account: %@", [[a getAddress] getHex]]]);
}

RCT_EXPORT_METHOD(removeKey:(NSString*)address pass1:(NSString*)pass1 callback:(RCTResponseSenderBlock)callback)
{
  NSError *e;
  for(int i = 0; i < [[ks getAccounts] size]; i++)
  {
    GethAccount* newAcc = [[ks getAccounts] get:i error:&e];
    if([[[[newAcc getAddress] getHex] uppercaseString] isEqualToString:[address uppercaseString]])
    {
      [ks deleteAccount:newAcc passphrase:pass1 error:&e];
      break;
    }
  }
  
  if(e)
    callback(@[[NSString stringWithFormat:@"Error: %@", e]]);
  else
    callback(@[@"Success! Account deleted"]);
}

RCT_EXPORT_METHOD(exportKey:(NSString*)address pass1:(NSString*)pass1 pass2:(NSString*)pass2 callback:(RCTResponseSenderBlock)callback)
{
  NSError *e;
  GethAccount* a;
  for(int i = 0; i < [[ks getAccounts] size]; i++)
  {
    GethAccount* newAcc = [[ks getAccounts] get:i error:&e];
    if([[[[newAcc getAddress] getHex] uppercaseString] isEqualToString:[address uppercaseString]])
    {
      a = newAcc;
      break;
    }
  }
  
  NSData* keyData = [ks exportKey:a passphrase:pass1 newPassphrase:pass2 error:&e];
  if(e)
    callback(@[[NSString stringWithFormat:@"*** error exporting key %@", e]]);
  else {
    NSURL *url = [NSURL fileURLWithPath:[NSHomeDirectory() stringByAppendingString:[NSString stringWithFormat:@"/Documents/ETH+%@.key", [[a getAddress] getHex]]]];
    bool written = [keyData writeToURL:url atomically: YES];
    if(written)
      callback(@[@"*** _ACCOUNT exported to Documents directory"]);
  }
}


RCT_EXPORT_METHOD(createKey:(NSString*)pass1 callback:(RCTResponseSenderBlock)callback)
{
  NSError *e;
  GethAccount* newAccount = [ks newAccount:pass1 error:&e];
  if(e)
    callback(@[[NSString stringWithFormat:@"*** _ACCOUNT CREATED: %@", [[newAccount getAddress] getHex]]]);
  else
    callback(@[[NSString stringWithFormat:@"*** error creating account: %@", e]]);
}


RCT_EXPORT_METHOD(sendEther:(NSString*)from  to:(NSString*)to gas:(NSString*)gas pass1:(NSString*)pass1 howMuch:(NSString*)howMuch callback:(RCTResponseSenderBlock)callback)
{
  GethBigInt* value = GethNewBigInt(0);
  [value setString:howMuch base:10];
  int64_t gasLimit = [gas intValue];
  
  NSError* e;
  GethEthereumClient* ethereumClient = [node getEthereumClient:&e];
  GethBigInt* gasPrice = [ethereumClient suggestGasPrice:gCtx error:&e];
  
  int64_t nonce;
  [ethereumClient getPendingNonceAt:gCtx account:GethNewAddressFromHex(from, &e) nonce:&nonce error:&e];
  
  GethTransaction* transaction = GethNewTransaction(nonce, GethNewAddressFromHex(to, &e), value, gasLimit, gasPrice, [howMuch dataUsingEncoding:NSUTF8StringEncoding]);

  GethAccount* a;
  for(int i = 0; i < [[ks getAccounts] size]; i++)
  {
    GethAccount* newAcc = [[ks getAccounts] get:i error:&e];
    if([[[[newAcc getAddress] getHex] uppercaseString] isEqualToString:[from uppercaseString]])
    {
      a = newAcc;
      break;
    }
  }
  
  [ks timedUnlock:a passphrase:pass1 timeout:10000000 error:&e];
  if(e)
    callback(@[[NSString stringWithFormat:@"*** error unlock: %@", e]]);
  
  transaction = [ks signTx:a tx:transaction chainID:nil error:&e];
  if(e)
    callback(@[[NSString stringWithFormat:@"*** error signTx: %@", e]]);
  
  [ethereumClient sendTransaction:gCtx tx:transaction error:&e];
  if(e)
    callback(@[[NSString stringWithFormat:@"*** error send transaction: %@", e]]);
  else
    callback(@[[NSString stringWithFormat:@"Success! TxHash: %@", [transaction getHash]]]);
}

//    //                android.util.Log.d("", "Cost: " + transaction.getCost());
//    //                android.util.Log.d("", "GasPrice: " + transaction.getGasPrice());
//    //                android.util.Log.d("", "Gas: " + transaction.getGas());
//    //                android.util.Log.d("", "Nonce: " + transaction.getNonce());
//    //                android.util.Log.d("", "Value: " + transaction.getValue());
//    //                android.util.Log.d("", "Sig-Hash Hex: " + transaction.getSigHash().getHex());
//    //                android.util.Log.d("", "Hash Hex: " + transaction.getHash().getHex());
//    //                android.util.Log.d("", "Data-Length: " + transaction.getData().length);
//    //                android.util.Log.d("", "To: " + transaction.getTo().getHex());
//    //                android.util.Log.d("", "Sender: " + transaction.getFrom(new BigInt(0)).getHex());
//    



RCT_EXPORT_METHOD(initEth)
{
  if(nodeInitialized)
    return;
  
  nodeInitialized = true;
  
  GethSetVerbosity(6);
  
  NSError *e;
//  GethEnodes* bootstrap = GethNewEnodes(2);
//  GethEnode* mainBootstrap = GethNewEnode(@"enode://1117da9f270b352d840ac7c8a55c459d86a6af54d3d0c352c69a01b0261eb2e446ab4bac2dd1f9fadb7c163dbb7feb53f9cea52fc2373788518ed86e6d32b57e@85.25.34.76:30303?discport=30304", &e);
//  if(e)
//    RCTLogError(@"ERR: %@", e);
//  GethEnode* localBootstrap = GethNewEnode(@"enode://b005e67fa8baf9bd2047edbd6e89b9abb22f6778958605a4bd1eccf432b215bc0f5879561b776265503032152805c9084b96ad8c486d099b5c63501d50489f5b@127.0.0.1:30299?discport=30300", &e);
//  if(e)
//    RCTLogError(@"ERR: %@", e);
//  [bootstrap set:0 enode:localBootstrap error:&e];
//  if(e)
//    RCTLogError(@"ERR: %@", e);
//  [bootstrap set:1 enode:mainBootstrap error:&e];
//  if(e)
//    RCTLogError(@"ERR: %@", e);
  
  GethNodeConfig* nc = GethNewNodeConfig();
//  [nc setBootstrapNodes:bootstrap];
//  [nc setEthereumNetworkID:15];
//  NSString* gns = [[NSBundle mainBundle]pathForResource:@"15network" ofType:@"json"];
//  RCTLogInfo(@"<<< genesis json: [%@]", [NSString stringWithContentsOfFile:gns encoding:NSUTF8StringEncoding error:&e]);
//  [nc setEthereumGenesis:[NSString stringWithContentsOfFile:gns encoding:NSUTF8StringEncoding error:&e]];

    [nc setEthereumNetworkID:3];
    [nc setEthereumGenesis: GethTestnetGenesis()];
  
  [nc setEthereumEnabled:true];
  
  node = GethNewNode([NSHomeDirectory() stringByAppendingString:@"/Library/.eth3"], nc, &e);
  if(e)
    RCTLogError(@"ERR: %@", e);
  [node start:&e];
  if(e)
    RCTLogError(@"ERR: %@", e);
}

- (NSArray<NSString *> *)supportedEvents
{
  return @[@"blocksUpdate"];
}

@end
