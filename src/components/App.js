import React, { Component } from 'react';
import Home from './Home';
import '../App.css';
import AllItems from './AllItems';
import MakeList from './MakeList';
import ShoppingList from './ShoppingList';
import SavedLists from './SavedLists';
import { BrowserRouter, Route } from 'react-router-dom';
import * as firebase from 'firebase'


class App extends Component {

  constructor() {
    super();
    this.state={items: [], lists: []};
  }

  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <Route path="/"
              render={(props) => <Home {...props} />} />
          <Route  path="/all-items"
              render={(props) => <AllItems {...props}
                allItems={this.state.items}/>} />
          <Route  path="/make-list"
              render={(props) => <MakeList {...props} 
                allItems={this.state.items}/>} />
          <Route  path="/shopping-list/:name"
              render={(props) => <ShoppingList {...props}
                lists={this.state.lists}/>} />
          <Route  path="/saved-lists"
              render={(props) => <SavedLists {...props}
                lists={this.state.lists}/>} />
        </div>
      </BrowserRouter>
    );
  }

  componentDidMount() {
    this.loadItems();
    this.loadLists();
  }


  loadItems() {
    var itemsRef = firebase.database().ref('/items');
    itemsRef.on("value", function(snapshot) {
      if (snapshot.val()) {
        var items = snapshot.val().items;
        this.setState({items: items});
      }
    }.bind(this));
  }

  loadLists() {
    var listsRef = firebase.database().ref('/lists');
    listsRef.on("value", function(snapshot) {
      console.log("before", snapshot.val());
      if (snapshot.val()) {
        var lists = snapshot.val();
        this.setState({lists: lists});
      }
    }.bind(this));
  }

}

export default App;
