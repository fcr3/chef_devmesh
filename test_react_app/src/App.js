import React, {Component} from 'react';
import WebcamCapture from './WebcamCapture'
import UploadComponent from './UploadComponent'
import Ingredient from './Ingredient'
import num_to_food from './PredMap'
import config from './config'
import axios from 'axios';
import taco from './taco.png';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'

import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';

import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.detectFood = this.detect.bind(this)
    this.getResult = this.getResult.bind(this)
    this.getImageSrc = this.getImageSrc.bind(this)
    this.getUploadSrc = this.getUploadSrc.bind(this)
    this.deleteIng = this.deleteIng.bind(this)
    this.state = {
      axiosResultImg: '',
      axiosResultStatus: '',
      task_id: '',
      task_info: '',
      imageSrc: '',
      interval_id: '',
      recipes: [],
      add_ingredient: ''
    }
  }

  /*
  * This is for the destructering of my json response.
  * You shouldn't have to edit this that much!
  */
  getResult() {
    if (this.state.task_id === undefined || this.state.task_id === null ||
        this.state.task_id === '') {
      return
    }
    var BACKEND_URL = "http://127.0.0.1:5000"
    axios.get(`${BACKEND_URL}/status/${this.state.task_id}`)
    .then((response) => {
      console.log(response.data)
      if (response.data.state === 'FAILURE' || response.data.state === 'incomplete') {
        clearInterval(this.state.interval_id)
        this.setState({
          ...this.state,
          task_id: '',
          interval_id: '',
          axiosResultStatus: response.data.status,
          axiosResultImg: ''
        })
      }

      if (response.data.status === 'completed') {
        clearInterval(this.state.interval_id)
        console.log(response.data.info_state === '')
        this.setState({
          ...this.state,
          task_id: '',
          task_info: response.data.info_state !== '' ?
            response.data.info_state.split(",").map((val) => {
              return num_to_food[val]
            }) : ['_'],
          interval_id: '',
          axiosResultStatus: response.data.status,
          axiosResultImg: response.data.result
        })
      } else {
        this.setState({
          ...this.state,
          axiosResultStatus: response.data.status
        })
      }
    })
  }

  /*
  * This is the main function to call our REST API.
  * Might change the BACKEND_URL to fit our actual host:port.
  * In setState, you see this setInterval. This pings the
  * backend every two seconds (hence 2000 in milliseconds)
  * by calling the getResult function (see first argument).
  */
  detect(img, model_type) {
    // Call to axios, img base64 encoded
    var BACKEND_URL = "http://127.0.0.1:5000"
    const device = 'cpu'
    axios.post(`${BACKEND_URL}/detect` , {img, model_type, device}, {
      headers: {
        'Content-Type': 'application/json'
      },
      withCredentials: true
    }).then((response) => {
        this.setState({
          ...this.state,
          task_id: response.data.task_id,
          interval_id: setInterval(this.getResult, 2000)
        })
    }).catch((e) => {console.log(e);});
  }

  /*
  * Access Edamam API for recipes from detected ingredients.
  * Takes in an array. Sets the state variable recipes to
  * an array of recipes given by the response.
  */
  getRecipes(ingredients) {
    var q = ""
    ingredients.forEach((val, index) => {
      q = index === 0 ? val : q + "+" + val
    })

    const app_id = config['APP_ID']
    const app_key = config['APP_KEY']
    const API_URL = 'https://api.edamam.com/search'

    if (ingredients.length === 0) {
      console.log(ingredients)
      console.log(q)
      return
    }

    axios.get(API_URL, {params: {q, app_id, app_key}}).then((res) => {
      console.log(res.data)
      const {data: {hits}} = res
      var recipes = hits.map((val, index) => {
        const {recipe} = val
        const {url, ingredientLines, calories, healthLabels, label, source, image} = recipe
        return {url, ingredientLines, calories, healthLabels, label, source, image}
      })
      console.log(recipes)
      this.setState({
        ...this.state,
        recipes
      })
    })
  }

  /*
  * This function allows the image base64 encoding to be passed
  * up to this component's state. Clever hack by passing it as
  * a prop to the WebcamCapture component. The WebcamCapture
  * component calls it every time the user hits 'Capture photo'.
  */
  getImageSrc(src) {
    this.setState({
      ...this.state,
      imageSrc: src
    })
  }

  /*
  * Pretty much the same thing as getImageSrc but for uploading
  * instead of taking pictures
  */
  getUploadSrc(src) {
    this.setState({
      ...this.state,
      imageSrc: src
    })
  }

  /*
  * Deletes ingredient from list
  */
  deleteIng(index_ref) {
    console.log(index_ref)
    this.setState({
      ...this.state,
      task_info: typeof this.state.task_info === 'object' ?
      this.state.task_info.filter((val, index) => {
        return index !== index_ref
      }) : this.state.task_info
    }, () => {
      console.log(this.state.task_info)
    })
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <AppBar color="primary" position="static">
            <Toolbar>
              <Typography color="inherit"
                style={{'display': 'flex', 'flexDirection': 'row', 'justifyContent': 'center',}}
              >
                <img src={taco} className="taco" alt="taco" style={{'width': '30px', 'height': '30px'}}/>
             </Typography>
             <Typography  variant='h5' color="inherit" style={{'marginLeft': '16px'}}>
               Chef.ai
             </Typography>
            </Toolbar>
          </AppBar>
        </header>

        <div>
          {config['TEST_VAR']}
        </div>

        <div>
          {config['PROD_VAR']}
        </div>

        <div style={{'display': 'flex', 'flexDirection': 'row', 'flexWrap': 'wrap'}}>
          <div style={{'display': 'flex', 'flexDirection': 'column'}}>
            <div style={{'margin': '2rem 2rem 0rem 2rem'}}>
              <h1>Take a picture of your groceries!</h1>
              <WebcamCapture passToApp={this.getImageSrc} />
              <h1>Upload a photo of your groceries!</h1>
              <UploadComponent fn={this.getUploadSrc} />
            </div>

            <div style={{'display': 'flex', 'flexDirection': 'column', 'margin': '2rem 2rem 0rem 2rem'}}>
              <h1>Let's see what we have!</h1>
              <div style={{'display': 'flex', 'flexDirection': 'row', 'justifyContent': 'center', 'alignItems': 'center'}}>
                <div onClick={(e) => this.detect(this.state.imageSrc, 'food')} style={{'marginRight': '1rem'}}>
                  <Button variant="contained" color="secondary">Detect Food</Button>
                </div>

              </div>
            </div>
          </div>

          <div style={{'margin': '2rem', 'display': 'flex', 'flexDirection': 'column'}}>
            <h1>Ooo Pretty!</h1>
            <div style={{'display': 'flex', 'flexDirection': 'column'}}>
              <div style={{'marginRight': '2rem'}}>
                <h3>Input Image</h3>
                {
                  this.state.imageSrc ?
                  <img src={this.state.imageSrc} height="200" alt="img"/> :
                  <p>Take a picture!</p>
                }
              </div>
              <div>
                <h3>Result Image</h3>
                {
                  this.state.axiosResultImg !== '' ?
                  <img src={this.state.axiosResultImg} height="200" alt="img"/> :
                  null
                }
              </div>
            </div>
          </div>

          <div style={{'margin': '2rem'}}>
            <h1>Ingredients</h1>
            <div>
              {this.state.task_info !== '' || this.state.task_info.length > 0 ?
                this.state.task_info.map((val, index) => {
                  return (
                    <Ingredient key={index} index={index} val={val} fn={this.deleteIng} />
                  )
              }) : "No ingredients detected :( Take another picture?"}
              {
                this.state.task_info !== '' ? (
                  <div>
                    <h3>Didn't see what you expected? Add More!</h3>
                    <form>
                      Additonal Ingredient: <br />
                      <div style={{'display': 'flex','flexDirection': 'row','marginTop': '4px'}}>
                          <input type='text' name='ingredient' onChange={
                              (e) => {
                                this.setState({
                                  ...this.state,
                                  add_ingredient: e.target.value
                                })
                              }
                            }/>
                          <span style={{
                              'borderRadius': '100px',
                              'color': 'white', 'backgroundColor': 'black',
                              'marginLeft': '8px', 'width': '18px', 'height': '18px',
                              'display': 'flex', 'flexDirection': 'row',
                              'justifyContent': 'center', 'alignItems': 'center',
                              'fontWeight': 'bold', 'cursor': 'pointer'
                            }} onClick={(e) => {
                              this.setState({
                                ...this.state,
                                task_info: this.state.task_info[0] === '_' ?
                                [this.state.add_ingredient]
                                : [...this.state.task_info, this.state.add_ingredient]
                              })
                            }}>+</span>
                      </div>
                    </form>
                    <Button variant="contained" color="secondary" style={{
                        'marginTop': '16px'
                      }} onClick={(e) => this.getRecipes(this.state.task_info)}>Get Recipes</Button>
                  </div>
                ) : null
              }
            </div>
          </div>

          <div style={{'margin': '2rem', 'display': 'flex', 'flexDirection': 'column'}}>
            <h1>Recipes</h1>
            <div style={{'display': 'flex', 'flexDirection': 'row', 'flexWrap': 'wrap'}}>
              {
                this.state.recipes.length > 0 ?
                this.state.recipes.map((val, index) => {
                  return (
                  /** Original Code in case I messed up */
                  // <Paper key={index} style={{'margin': '1rem', 'width': '500px','padding': '0.5rem', 'wordWrap': 'break-word'}}>
                  //   <h3>{val.label} by {val.source}</h3>
                  //   <img src={val.image} alt="food_image" />
                  //   <h4>Calories</h4>
                  //   <p>{val.calories}</p>
                  //   <h4>Health Labels</h4>
                  //   <ul>
                  //     {val.healthLabels.map((val_h, index_h) => {
                  //       return (<li key={index_h}>{val_h}</li>)
                  //     })}
                  //   </ul>
                  //   <h4>Ingredient List</h4>
                  //   <ul>
                  //     {val.ingredientLines.map((val_ing, index_ing) => {
                  //       return (<li key={index_ing}>{val_ing}</li>)
                  //     })}
                  //   </ul>
                  //   <h4>URL</h4>
                  //   <p><a href={val.url}>{val.url}</a></p>
                  // </Paper>

                  /** New code w/ card */
                  <Card key={index} style={{'margin': '1rem', 'width': '500px','padding': '0.5rem', 'wordWrap': 'break-word'}}>
                     <CardActionArea>
                     <CardMedia
                        style={{'height': '140px'}}
                        image={val.image}
                        title={val.label + " by " + val.source}
                      />
                      <CardContent>
                        <Typography gutterBottom variant="h5" component="h2">
                          {val.label} by {val.source}
                        </Typography>
                        <Typography variant="body2" color='black' component="p">
                          Calories
                        </Typography>
                        <Typography variant="body2" color="textSecondary" component="p">
                        {val.calories}
                        </Typography>
                        <Typography variant="body2" color='black' component="p">
                        Health Labels
                        </Typography>
                        <Typography variant="body2" color="textSecondary" component="p">
                        <ul>
                          {val.healthLabels.map((val_h, index_h) => {
                          return (<li key={index_h}>{val_h}</li>)
                          })}
                        </ul>
                        </Typography>
                        <Typography variant="body2" color='black' component="p">
                        Ingredient List
                        </Typography>
                        <Typography variant="body2" color="textSecondary" component="p">
                        <ul>
                          {val.ingredientLines.map((val_ing, index_ing) => {
                          return (<li key={index_ing}>{val_ing}</li>)
                          })}
                        </ul>
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <Button size="small" color="primary">
                          <a href='URL'>{val.url}</a>
                        </Button>
                      </CardActions>
                    </CardActionArea>
                  </Card>

                  )
                }) : null
              }
            </div>
          </div>

        </div>
      </div>
    );
  }
}

export default App;
