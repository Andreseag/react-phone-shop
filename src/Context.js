import React, { Component } from 'react'
import {storeProducts, detailProduct} from './data';
const ProductContext = React.createContext();
// Provider
// Consumer

class ProductProvider extends Component {
  state = {
    products:[],
    detailProduct: detailProduct,
    cart: [],
    modalOpen:false,
    modalProduct: detailProduct,
    cartSubTotal:0,
    cartTax:0,
    cartTotal:0
  };
  componentDidMount(){
    this.setProducts();
  }
  // Seteamos los productos del JSON  a traves de esta funcion
  setProducts = () => {
    let tempProducts = [];
    storeProducts.forEach(item =>{
      const singleItem = {...item};
      tempProducts = [...tempProducts,singleItem];

    })
    this.setState(()=>{
      return {products:tempProducts}
    })
  }

  // Capturamos el Item mediante el ID
  getItem = id =>{
    const product = this.state.products.find(item => item.id === id);
    return product;
  }
  // Esta funcion nos permite ver el detalle de cada uno de los productos por separado
  handleDetail = id => {
    const product = this.getItem(id);
    this.setState(()=>{
      return {detailProduct:product}
    })
  }
  addToCart = id => {
    let tempProducts = [...this.state.products];
    const index = tempProducts.indexOf(this.getItem(id));
    const product = tempProducts[index];
    product.inCart = true;
    product.count = 1;
    const price = product.price;
    product.total = price;
    this.setState(
      () => {
        return { product: tempProducts,cart: [...this.state.cart,
        product] };
      },
      () => {
      this.addTotals();
    });

  }
  // Codigo para generar la ventana modal con el producto agregado al carrito
  openModal = id => {
    const product = this.getItem(id);
    this.setState(() => {
      return {modalProduct:product, modalOpen:true}
    })
  }
  closeModal = () => {
    this.setState(()=>{
      return {modalOpen:false}
    })
  }
  // Este es el metodo que incrementa la cantidad del mismo articulo
  increment = (id) =>{
    // Hacemos el destructurin del carrito
    let tempCart = [...this.state.cart];
    // Buscamos el item usando el ID
    const selectedProduct = tempCart.find(item=>item.id === id);

    const index = tempCart.indexOf(selectedProduct);
    const product = tempCart[index];
    // Incrementamos la cantidad del prodcuto y el total 
    product.count = product.count + 1;
    product.total = product.count * product.price;
    // 
    this.setState(
      ()=>{
        return{cart:[...tempCart]};
      },
      ()=>{
        this.addTotals();
      })

  }
  // Este es el metodo que decrementa la cantidad del mismo articulo
  decrement = (id) =>{
    // Hacemos el destructurin del carrito
    let tempCart = [...this.state.cart];
    // Buscamos el item usando el ID
    const selectedProduct = tempCart.find(item=>item.id === id);

    const index = tempCart.indexOf(selectedProduct);
    const product = tempCart[index];

    product.count = product.count - 1;
    if(product.count === 0){
      this.removeItem(id);
    }else{
      product.total = product.count * product.price;
      this.setState(
        ()=>{
          return{cart:[...tempCart]};
        },
        ()=>{
          this.addTotals();
        })
    }
  }
  // Este elemento elimina el producto completo
  removeItem = (id) =>{
    let tempProducts = [...this.state.products];
    let tempCart = [...this.state.cart];

    tempCart= tempCart.filter(item => item.id !== id);
    const index = tempProducts.indexOf(this.getItem(id));
    let removedProduct = tempProducts[index];
    removedProduct.inCart = false;
    removedProduct.cout = 0;
    removedProduct.total = 0;

    this.setState(()=>{
      return {
        cart:[...tempCart],
        product:[...tempProducts]
      }
    },()=>{
      this.addTotals();
    })
  }
  // Est es el metodo para limpiar todo el carrito de compras
  clearCart = () =>{
    this.setState(()=>{
      return {cart: [] }
    },()=>{
      this.setProducts();
      this.addTotals();
    })
  }
  addTotals = () =>{
    let subTotal = 0;
    this.state.cart.map(item =>(subTotal += item.total));
    const tempTax = subTotal * 0.5;
    const tax = parseFloat(tempTax.toFixed(2));
    const total = subTotal + tax;
    this.setState(()=>{
      return{
        cartSubTotal: subTotal,
        cartTax: tax,
        cartTotal: total
      }
    })
  }
  render() {
    return (
      <ProductContext.Provider value={{
        ...this.state,
        handleDetail:this.handleDetail,
        addToCart:this.addToCart,
        openModal:this.openModal,
        closeModal:this.closeModal,
        increment:this.increment,
        decrement:this.decrement,
        removeItem:this.removeItem,
        clearCart:this.clearCart
      }}
      >
        {this.props.children}
      </ProductContext.Provider>
    )
  }
}


const ProductConsumer = ProductContext.Consumer;

export { ProductProvider, ProductConsumer };