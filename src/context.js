import React, { Component } from 'react'
import items from './data';

const CarContext = React.createContext();

class CarProvider extends Component {

  state = {
    cars: [],
    sortedCars: [],
    featuredCars: [],
    loading: true,
    //controlled input - cars filter component
    type: 'all',
    capacity: 1,
    price: 0,
    minPrice: 0,
    minSize: 0,
    maxSize: 0,
    breakfast: false,
    pets: false
  };

  // Get data
  componentDidMount() {
    let cars = this.formatData(items);

    // return featured cars from array
    let featuredCars = cars.filter(car => car.featured === true);

    //calculate default maximum price for each item in Array
    let maxPrice = Math.max(...cars.map(car => car.price));
    //calculate default maximum size for each item in Array
    let maxSize = Math.max(...cars.map(car => car.size));

    this.setState({
      cars,
      featuredCars,
      sortedCars: cars,
      loading: false,
      price: maxPrice,
      maxPrice,
      maxSize
    });
  }

  // Flattening data.js Array
  formatData = (items) => {
    let tempItems = items.map(item => {

      let id = item.sys.id;
      let images = item.fields.images.map(image => image.fields.file.url);

      // Copy of fields object from data.js and return
      let car = { ...item.fields, images, id }
      return car;

    });

    return tempItems
  }

  // getCar function to set up slug parameter via--react router
  getCar = (slug) => {
    let tempCars = [...this.state.cars];
    const car = tempCars.find(tempCar => tempCar.slug === slug)
    return car;
  }

  //form inputs - controlled input
  handleChange = e => {
    const type = e.target.type;
    const name = e.target.name;
    const value = e.target.value;
    console.log(type, name, value)
  }

  filterCars = () => {
    console.log('hello')
  }


  render() {
    return (
      <CarContext.Provider value={{ ...this.state, getCar: this.getCar, handleChange: this.handleChange }}>
        {this.props.children}
      </CarContext.Provider>
    )
  }
}

const CarConsumer = CarContext.Consumer;


//Higher order function that wraps component passed into in(carsContainer)
export function withCarConsumer(Component) {
  return function ConsumerWrapper(props) {
    return <CarConsumer>
      {value => <Component {...props} context={value} />}
    </CarConsumer>
  }
}

export { CarProvider, CarConsumer, CarContext }

