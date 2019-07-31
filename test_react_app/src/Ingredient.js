import React from 'react'

const Ingredient = (props) => {
  const {val, fn, index} = props
  return (
    <div key={index} style={{
      'display': 'flex', 'flexDirection': 'row', 'width': 'auto'
    }}>
      {val}
      <span style={{
          'borderRadius': '100px',
          'color': 'white', 'backgroundColor': 'black',
          'marginLeft': '8px', 'width': '18px', 'height': '18px',
          'display': 'flex', 'flexDirection': 'row',
          'justifyContent': 'center', 'alignItems': 'center',
          'fontWeight': 'bold', 'cursor': 'pointer'
        }} onClick={(e) => {
          fn(index)
        }}>-</span>
    </div>
  )
}

export default Ingredient
