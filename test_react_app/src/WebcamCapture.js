import React, {Component} from "react";
import Webcam from "react-webcam";
import Button from '@material-ui/core/Button';
import CameraIcon from '@material-ui/icons/PhotoCamera';
import Paper from '@material-ui/core/Paper';

/*
*
* Taken from the Webcam npm page/github page
* Sample code features how to access webcam features
*
*/
class WebcamCapture extends Component {
  setRef = webcam => {
    this.webcam = webcam;
  };

  capture = (props) => {
    const {passToApp} = props
    const imageSrc = this.webcam.getScreenshot();
    passToApp(imageSrc)
  };

  render() {
    const videoConstraints = {
      width: 1280,
      height: 720,
      facingMode: "user"
    };

    return (
      <div style={{
          'display': 'flex',
          'flexDirection': 'column',
          'alignItems': 'center',
          'justifyContent': 'center'
        }}>
        <Paper style={{
          'padding': '8px'
        }}>
          <Webcam
            audio={false}
            height={340}
            ref={this.setRef}
            screenshotFormat="image/jpeg"
            width={600}
            videoConstraints={videoConstraints}
          />
        </Paper>
        <Button variant="contained" color='secondary'
          onClick={(e) => this.capture(this.props)}
          style={{
            'marginTop': '16px'
          }}>
          <CameraIcon /> Capture Photo
        </Button>
      </div>
    );
  }
}

export default WebcamCapture;
