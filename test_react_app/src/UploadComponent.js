import React from 'react'

/*
* You can upload an image to send to the backend using
* this component. Takes in a function from App.js and
* uses it as a way to deal with the uploaded image.
*/

const UploadComponent = (props) => {
  const {fn} = props

  return (
    <div>
      <form>
        <input type="file" onChange={(e) => {
            console.log(e.target.files)
            var reader = new FileReader()
            reader.onload = (e) => {
              fn(e.target.result)
            }
            if (e.target.files[0] !== null && e.target.files[0] !== undefined) {
              reader.readAsDataURL(e.target.files[0])  
            }
          }} />
      </form>
    </div>
  )
}

export default UploadComponent
