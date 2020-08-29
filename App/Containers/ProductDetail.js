import React, { useState, useEffect } from 'react'
import {
  KeyboardAvoidingView,
  SafeAreaView,
  ActivityIndicator,
  ScrollView,
  TextInput,
  Dimensions,
  Image,
  View,
  Text
} from 'react-native'
import { connect } from 'react-redux'
import ArrowBack from '../Components/ArrowBack'
import Button from '../Components/Button'
import Format from '../Lib/NumberFormat'

import styles from './Styles/ProductDetailStyle'
import HeaderStyle from '../Navigation/Styles/NavigationStyles'
import { apply } from '../Lib/OsmiProvider'

const { width } = Dimensions.get('window')

const ProductDetail = props => {
  const { detail, navigation } = props
  const { data } = detail
  const stocks = navigation.getParam('stock', 0)
  const { formatMoney } = new Format()

  //State
  const [stock, setStock] = useState(stocks)
  const [qty, setQty] = useState(1)

  onBuy = () => {}

  onMin = () => {
    if(qty > stock) {
      setQty(stock)
    } else if(qty <= 1) {
      setQty(1)
    } else {
      setQty(qty-1)
    }
  }

  onPlus = () => {
    qty < stock ? setQty(qty+1) : setQty(stock)
  }

  onChange = (value) => {
    Number(value) > stock ? setQty(stock) : setQty(Number(value))
  }

  return (
    <SafeAreaView style={apply('bg-white flex')}>
      {detail?.fetching ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={apply('gray-900')} />
        </View>
      ) : (
        <>
        <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
          <Image style={{width: width, height: width, alignSelf: 'center'}} resizeMode='cover' source={{ uri: data.thumbnail }} />
          <View style={styles.detailSec}>
            <Text style={styles.price}>Rp{formatMoney(data.price)}</Text>
            <Text style={styles.title}>{data.title}</Text>
            <Text style={styles.stock}>Stock: {data.stock} pcs</Text>
          </View>
          <View style={styles.descSec}>
            <Text style={styles.descTitle}>Description :</Text>
            <Text style={styles.desc}>{data.desc}</Text>
          </View>
        </ScrollView>
        <View style={styles.footer}>
          <View style={styles.qty}>
            <Text style={styles.qtyLabel}>Qty: </Text>
            <Button text='-' style={styles.btnQty} onPress={() => onMin()} />
            <TextInput style={styles.qtyInput} maxLength={4} onChangeText={(value) => onChange(value)} keyboardType='numeric' value={qty.toString()} underlineColorAndroid={apply('gray-500')} />
            <Button text='+' style={styles.btnQty} onPress={() => onPlus()} />
          </View>
          <Button text='BUY NOW' style={styles.btnBuy} textStyle={styles.btnBuyLabel}/>
        </View>
        </>
      )}
    </SafeAreaView>
  )
}

const mapStateToProps = (state) => ({
  detail: state.products.detail
})

ProductDetail.navigationOptions = ({ navigation }) => {
  const { params = {} } = navigation.state

  return {
    headerStyle: HeaderStyle.default,
    headerTitle: navigation.getParam('title', 'Product Detail'),
    headerLeft: () => <ArrowBack />
  }
}

export default connect(mapStateToProps)(ProductDetail)
