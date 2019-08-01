require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`,
})

var configs =  {
  'TEST_VAR': "TESTING",
  'BACKEND_URL': 'URL FOR BACKEND',
  'APP_ID': 'APP ID FROM RECIPE API',
  'APP_KEY': 'API KEY FROM RECIPE API'
}

if (process.env.NODE_ENV === 'production') {
  console.log(process.env.COOL_VAR)

  configs =  {
    'TEST_VAR': process.env.COOL_VAR,
    'BACKEND_URL': 'URL FOR BACKEND',
    'APP_ID': 'APP ID FROM RECIPE API',
    'APP_KEY': 'API KEY FROM RECIPE API'
  }
}

export default configs
