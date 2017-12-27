
import {StyleSheet} from 'react-native'

export default styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonWrapper: {
    borderRadius: 4, borderWidth: 0.5, borderColor: '#d6d7da', marginTop: 22
  },
  lightButton: {
      backgroundColor:'white' 
  },
  lightButtonText: {
      color:'rgb(24, 188, 156)'
  },
  lightButtonTextDisabled: {
      color:'gray'
  }, 
  copyButton: {
      backgroundColor:'white', paddingHorizontal: 0
  },
  copyButtonText: {
      fontSize: 16, color: 'black'  
  },
  basicView: {
      flex:1, paddingHorizontal: 20, backgroundColor:'white'
  },
  addressCaption: {
      marginTop: 15, fontSize:19, fontFamily: 'Helvetica Neue',  color:'rgb(44, 62, 80)'
  },
  addressStyle: {
      fontSize:15, fontFamily: 'Helvetica Neue', color:'rgb(180, 188, 194)'
  },
  amountStyle: {
      marginLeft: 15, fontSize:19, fontFamily: 'Helvetica Neue',  color:'rgb(44, 62, 80)'
  }
});
