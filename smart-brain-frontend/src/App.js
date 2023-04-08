import React from 'react';
import Particles from 'react-particles-js';

import './App.css';
import 'tachyons';

import Navigation from './components/navigation/Navigation';
import Logo from './components/logo/Logo';
import Rank from './components/rank/Rank';
import ImageLinkForm from './components/image-link-form/ImageLinkForm';
import FaceRecognition from './components/face-recognition/FaceRecognition';
import SignIn from './components/signin/SignIn';
import Register from './components/register/Register';

const particlesOptions = {
  particles: {
    number: {
      value: 30,
      density: {
        enable: true,
        value_area: 150
      }
    }
  }
}

const initialState = {
  imageUrl: '',
  box: {},
  route: 'signin',
  isSignedIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: ''
  }
}

// ===== implementation =====
class App extends React.Component {
  constructor() {
    super()
    this.state = initialState;
  }

  loadUser = (userData) => {
    this.setState({
      user: {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        entries: userData.entries,
        joined: userData.joined
      }
    });
  }

  displayFacesBoundingBoxes = aBox => {
    this.setState({ box: aBox })
  }

  onInputChange = event => {
    this.setState({ imageUrl: event.target.value })
  }

  calculateFacesBoundingBoxes = data => {
    const clarifaiFace =
      data.outputs[0].data.regions[0].region_info.bounding_box

    const image = document.getElementById('inputImage')
    const imageWidth = Number(image.width)
    const imageHeight = Number(image.height)

    return {
      topRow: clarifaiFace.top_row * imageHeight,
      leftCol: clarifaiFace.left_col * imageWidth,
      bottomRow: imageHeight - clarifaiFace.bottom_row * imageHeight,
      rightCol: imageWidth - clarifaiFace.right_col * imageWidth
    }
  }

  onDetectButtonSubmit = () => {
    fetch('https://aqueous-gorge-03890.herokuapp.com/imageurl', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        input: this.state.imageUrl
      })
    })
      .then(response => response.json())
      .then(response => {
        if (response) {
          fetch('https://aqueous-gorge-03890.herokuapp.com/image', {
            method: 'put',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id: this.state.user.id
            })
          })
            .then(response => response.json())
            .then(count => {
              this.setState(Object.assign(this.state.user, { entries: count }))
            })
            .catch(console.log)
        }
        this.displayFacesBoundingBoxes(this.calculateFacesBoundingBoxes(response));
      })
      .catch(err => console.log(err))
  }

  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState(initialState);
    } else if (route === 'home') {
      this.setState({ isSignedIn: true });
    }
    this.setState({ route: route });
  }

  render() {
    return (
      <div className='App'>
        <Particles className='particles' params={particlesOptions} />
        <Navigation
          isSignedIn={this.state.isSignedIn}
          onRouteChangeCallback={this.onRouteChange} />
        {
          this.state.route === 'home' ?
            <div>
              <Logo />
              <Rank
                name={this.state.user.name}
                entries={this.state.user.entries} />
              <ImageLinkForm
                onInputChange={this.onInputChange}
                onButtonSubmit={this.onDetectButtonSubmit}
              />
              <FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl} />
            </div>
            : (
              this.state.route === 'signin' ?
                <SignIn
                  loadUserCallback={this.loadUser}
                  onRouteChangeCallback={this.onRouteChange} />
                :
                <Register
                  loadUserCallback={this.loadUser}
                  onRouteChangeCallback={this.onRouteChange} />
            )
        }
      </div>
    )
  }
}

export default App
