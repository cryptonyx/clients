//
//  RNEthController.m
//  Eth
//
//  Created by User on 04.01.18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import "RNEthController.h"
#import <React/RCTLog.h>
#import "Geth/Geth.h"

@implementation RNEthController

// To export a module named CalendarManager
RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(addEvent:(NSString *)name location:(NSString *)location)
{
  RCTLogInfo(@"Pretending to create an event %@ at %@", name, location);
}



//Geth.setVerbosity(4);
//
//
//Enodes bootstrap = new Enodes(1);
//Enode mainBootstrap = Geth.newEnode(
//                                    "enode://d57927dede8c7292cc3f737c246eddd586efff0c0f5714f10f967006c118de83ae69bf84047c18bfb25d61c24110510ba4c575f203b225d90165879c5a069d60@85.25.34.76:30303?discport=30304");
//bootstrap.set(0, mainBootstrap);
//
//
//NodeConfig nc = new NodeConfig();
//nc.setBootstrapNodes(bootstrap);
//nc.setEthereumNetworkID(15);
//nc.setEthereumGenesis("{\n" +
//                      "    \"config\": {\n" +
//                      "        \"chainId\": 15,\n" +
//                      "        \"homesteadBlock\": 0,\n" +
//                      "        \"eip155Block\": 0,\n" +
//                      "        \"eip158Block\": 0\n" +
//                      "    },\n" +
//                      "    \"difficulty\": \"400000\",\n" +
//                      "    \"gasLimit\": \"210000\",\n" +
//                      "    \"alloc\": {\n" +
//                      "        \"36e5f859479ff980fe39d1490a158b2c89600043\": { \"balance\": \"300000000000000000000\" },\n" +
//                      "        \"906d9a0de55ab73b64e2a29c3fc0b536160813d6\": { \"balance\": \"400000000000000000000\" }\n" +
//                      "    }\n" +
//                      "}");
//nc.setEthereumEnabled(true);
//Node node = Geth.newNode(getReactApplicationContext().getFilesDir() + "/.eth1", nc);
//node.start();



RCT_EXPORT_METHOD(initEth)
{
  GethSetVerbosity(6);
  
  GethEnodes* bootstrap = GethNewEnodes(1);
  NSError *e;
  GethEnode* mainBootstrap = GethNewEnode(@"enode://1117da9f270b352d840ac7c8a55c459d86a6af54d3d0c352c69a01b0261eb2e446ab4bac2dd1f9fadb7c163dbb7feb53f9cea52fc2373788518ed86e6d32b57e@85.25.34.76:30303?discport=30304", &e);
  GethEnode* localBootstrap = GethNewEnode(@"enode://0711e93ce6154960af624ca0c7733238951d33efb9437f982333dc887157a97486ec69a344d9255de14fce464a2847443ceea2f2c47a995b83feb9fe9be15252@127.0.0.1:30303?discport=30304", &e);
  NSLog(@"ERR: %@", e);
  [bootstrap set:0 enode:localBootstrap error:&e];
  [bootstrap set:1 enode:mainBootstrap error:&e];
  NSLog(@"ERR: %@", e);
  GethNodeConfig* nc = GethNewNodeConfig();

  [nc setBootstrapNodes:bootstrap];
//    [nc setEthereumNetworkID:3];
//    [nc setEthereumGenesis: GethTestnetGenesis()];
  [nc setEthereumNetworkID:15];
  [nc setEthereumGenesis:@"{\n"
                          "    \"config\": {\n"
                          "        \"chainId\": 15,\n"
                          "        \"homesteadBlock\": 0,\n"
                          "        \"eip155Block\": 0,\n"
                          "        \"eip158Block\": 0\n"
                          "    },\n"
                          "    \"difficulty\": \"400000\",\n"
                          "    \"gasLimit\": \"2100000000\",\n"
                          "    \"alloc\": {\n"
                          "        \"36e5f859479ff980fe39d1490a158b2c89600043\": { \"balance\": \"300000000000000000000\" },\n"
                          "        \"906d9a0de55ab73b64e2a29c3fc0b536160813d6\": { \"balance\": \"400000000000000000000\" }\n"
                          "    }\n"
                           "}"];
  [nc setEthereumEnabled:true];
  
  GethNode* node = GethNewNode([NSHomeDirectory() stringByAppendingString:@"/Library/.eth3"], nc, &e);
  NSLog(@"ERR: %@", e);
  [node start:&e];
  NSLog(@"ERR: %@", e);
}

@end
