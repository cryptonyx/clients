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
  GethEnode* mainBootstrap = GethNewEnode(@"enode://d57927dede8c7292cc3f737c246eddd586efff0c0f5714f10f967006c118de83ae69bf84047c18bfb25d61c24110510ba4c575f203b225d90165879c5a069d60@85.25.34.76:30303?discport=30301", &e);
  [bootstrap set:0 enode:mainBootstrap error:&e];
  
  GethNodeConfig* nc = GethNewNodeConfig();
  [nc setBootstrapNodes:bootstrap];
  [nc setEthereumNetworkID:15];
  [nc setEthereumGenesis:@"{\n"
                          "    \"config\": {\n"
                          "        \"chainId\": 15,\n"
                          "        \"homesteadBlock\": 0,\n"
                          "        \"eip155Block\": 0,\n"
                          "        \"eip158Block\": 0\n"
                          "    },\n"
                          "    \"difficulty\": \"400000\",\n"
                          "    \"gasLimit\": \"210000\",\n"
                          "    \"alloc\": {\n"
                          "        \"36e5f859479ff980fe39d1490a158b2c89600043\": { \"balance\": \"300000000000000000000\" },\n"
                          "        \"906d9a0de55ab73b64e2a29c3fc0b536160813d6\": { \"balance\": \"400000000000000000000\" }\n"
                          "    }\n"
                           "}"];
  [nc setEthereumEnabled:true];
  
  GethNode* node = GethNewNode(@"./.eth1", nc, &e);
  [node start:&e];
}

@end
