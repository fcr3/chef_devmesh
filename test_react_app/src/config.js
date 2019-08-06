var configs =  {
  'TEST_VAR': "TESTING",
  'BACKEND_URL': 'URL FOR BACKEND',
  'APP_ID': 'APP ID FROM RECIPE API',
  'APP_KEY': 'API KEY FROM RECIPE API'
}

if (process.env.NODE_ENV === 'production') {
  console.log(process.env)
  console.log(process.env.TEST_KEY)
  console.log(process.env.REACT_APP_TEST_KEY)

  configs =  {
    'PROD_VAR': "PROD_VAR",
    'TEST_VAR': process.env.TEST_KEY,
    'BACKEND_URL': 'URL FOR BACKEND',
    'APP_ID': 'APP ID FROM RECIPE API',
    'APP_KEY': 'API KEY FROM RECIPE API'
  }
}

export default configs
