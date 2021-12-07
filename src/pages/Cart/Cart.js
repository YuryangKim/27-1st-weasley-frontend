import React, { useState, useEffect } from 'react';
import { API } from '../../../src/config';
import EmptyCart from './EmptyCart';
import List from './List';
import Price from './Price';
import Nav from '../../components/Nav/Nav';
import '../Cart/Cart.scss';

function Cart() {
  const [cart, setCart] = useState([]);
  const [empty, setEmpty] = useState(true);

  useEffect(() => {
    fetch(API.CART, {
      method: 'get',
      headers: {
        Authorization:
          'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6Mn0.bHQK7d38oajQKa3Hl8nsYrqDhp9m2fmo_MWjDWMN4Zs',
      },
    })
      .then(res => res.json())
      .then(data => {
        if (data.RESULT.cart_items.length === 0) {
          setEmpty(true);
        } else {
          setEmpty(false);
          setCart(data.RESULT.cart_items);
        }
      });
  }, []);

  const increaseCartItem = targetIndex => {
    const newCartItem = {
      ...cart[targetIndex],
      amount: cart[targetIndex].amount + 1,
    };
    const newCart = cart.map((item, itemIndex) => {
      if (itemIndex === targetIndex) {
        return newCartItem;
      } else {
        return item;
      }
    });
    setCart(newCart);
  };

  const decreaseCartItem = targetIndex => {
    const newCartItem = {
      ...cart[targetIndex],
      amount: cart[targetIndex].amount - 1,
    };

    const newCart = cart.map((item, itemIndex) => {
      if (itemIndex === targetIndex) {
        return newCartItem;
      } else {
        return item;
      }
    });
    setCart(newCart);
  };

  const eraseCartItem = productId => {
    const filteredCart = cart.filter(item => {
      return item.product_id !== productId;
    });

    setCart(filteredCart);
  };

  const handleDeleteAll = () => {
    let lists_id = cart.map(list => {
      return list.cart_id;
    });

    fetch(`${API.CART}?id=${JSON.stringify(lists_id)}`, {
      method: 'delete',
      headers: {
        Authorization:
          'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6Mn0.bHQK7d38oajQKa3Hl8nsYrqDhp9m2fmo_MWjDWMN4Zs',
      },
    })
      .then(res => res.json())
      .then(data => {
        data.MESSAGE === 'DELETED' ? setCart([]) : alert(data.MESSAGE);
      })
      .catch(error => alert(error));
  };

  return (
    <div>
      {empty ? (
        <EmptyCart />
      ) : (
        <>
          <Nav />
          <main className="cartMain">
            <div className="title">장바구니</div>
            <button
              className="removeAll"
              onClick={() => {
                window.confirm('전체삭제 하시겠습니까?')
                  ? handleDeleteAll()
                  : setCart(...cart);
              }}
            >
              전체삭제
            </button>
            {cart.map(function (list, index) {
              return (
                <List
                  setEmpty={setEmpty}
                  eraseCartItem={() => eraseCartItem(list.product_id)}
                  list={list}
                  increaseCartItem={() => increaseCartItem(index)}
                  decreaseCartItem={() => decreaseCartItem(index)}
                  key={list.product_id}
                  API={API}
                  cart={cart}
                  setCart={setCart}
                />
              );
            })}

            <Price cart={cart} />

            <div className="orderBtn">
              <button>주문하기</button>
            </div>
          </main>
        </>
      )}
    </div>
  );
}

export default Cart;
