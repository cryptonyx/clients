// ES6 module syntax
import LocalizedStrings from 'react-native-localization';

// CommonJS syntax
// let LocalizedStrings  = require ('react-native-localization');

 strings = new LocalizedStrings({
//  "en-US":{
//     wallets: 'Wallets',
//  	importBtnCap:"Import wallet",
//    how:"How do you want your egg today?",
//    boiledEgg:"Boiled egg",
//    softBoiledEgg:"Soft-boiled egg",
//    choice:"How to choose the egg"
//  },
 en:{
    // Common
    processing: 'processing',

    // About
    about: 'About',
    aboutText: 'Please, send suggestions to support@nyx.insure',

   // Capture screen
    capture: "Point the camera at the QR code and wait for the window to close",

    // Transacions list screen
    usedGas: "Gas spent",
    age: "Age",
    transactions: 'Transactions',

    // Transaction screen
    source: "Source",
    destination: "Destination",
    sum: "Sum",
    gasLimit: "Gas limit",
    password: "password",

   // Review wallet screen
  removeTitle: "Enter password to remove Wallet",
  exportTitle: "Enter passwords to export wallet",
   copied: 'copied',
    manageWallet: 'Manage wallet',  
   address: 'Address',
   copy: 'copy',
   sendEtherBtnCap: 'Send ether',
   viewTransactionsBtnCap: 'Transactions',
   exportKeyBtnCap: 'Export wallet',
   removeWalletBtnCap: 'Remove wallet (irreversible)', 

   cancel: 'Cancel',
   onePasswordCap: 'Enter password for new wallet',
   twoPasswordsCap: "Enter two passwords to import wallet",
   createBtnCap: 'Create wallet',
   createOrImport: 'Create or import wallet',
   peers: "peers",
   lastBlock: 'last block',
   wallets: 'NYX',
 	importBtnCap:"Import wallet",
   how:"How do you want your egg today?",
   boiledEgg:"Boiled egg",
   softBoiledEgg:"Soft-boiled egg",
   choice:"How to choose the egg"
 },
 ru: {
    // Common
    processing: 'обработка',
    
    // About
    about: 'О программе',
    aboutText: 'Пожелания принимаются на адрес support@nyx.insure',

    // Capture screen
    capture: "Наведите на QR код и дождитесь автоматического закрытия этого окна",

    // Transacions list screen
    usedGas: "Истраченный газ",
    age: "Возраст",
    transactions: 'Транзакции',

    // Transaction screen
    source: "Отправитель",
    destination: "Получатель",
    sum: "Сумма",
    gasLimit: "Лимит газа",
    password: "Пароль",


    // Review wallet screen
    removeTitle: "Введите пароль кошелька",
   exportTitle: "Введите пароли для экспорта кошелька",
   copied: 'скопировано',
    manageWallet: 'Управление кошельком',
   address: 'Адрес',
   copy: 'скопировать',
   sendEtherBtnCap: 'Отправить эфир',
   viewTransactionsBtnCap: 'Транзакции',
   exportKeyBtnCap: 'Экспорт кошелька',
   removeWalletBtnCap: 'Удалить кошелёк (необратимо!)', 

 cancel: 'Отмена',
  onePasswordCap: 'Придумайте пароль для нового кошелька',
  twoPasswordsCap: "Введите два пароля, которые были заданы при экспорте ключа кошелька в файл",
  createBtnCap: 'Новый кошелёк',
   createOrImport: 'Импортировать или создать кошелёк', 
   peers: 'пиры',
   lastBlock: 'послед. блок',
   wallets: 'NYX',
 	importBtnCap:"Импортировать кошелёк",
   how:"Come vuoi il tuo uovo oggi?",
   boiledEgg:"Uovo sodo",
   softBoiledEgg:"Uovo alla coque",
   choice:"Come scegliere l'uovo"
 }
});

module.exports = strings