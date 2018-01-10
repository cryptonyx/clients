//
//  RNEthController.h
//  Eth
//
//  Created by User on 04.01.18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>
#import "Geth/Geth.h"


@interface TestNative : RCTEventEmitter <RCTBridgeModule, GethNewHeadHandler>

@end


