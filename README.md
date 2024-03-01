# Express Proxy

[express-proxy-3fa2dcca9dad.herokuapp.com](https://express-proxy-3fa2dcca9dad.herokuapp.com/api)

## Usage example

### Using Fetch

```js
async function fetchData() {
  const url = "https://express-proxy-3fa2dcca9dad.herokuapp.com/api?url=http://exampleapi.com/data";

  try {
    const response = await fetch(url);
    const data = await response.json(); // Assuming the API returns JSON data
    console.log(data);
  } catch (error) {
    console.error("Error:", error);
  }
}

fetchData();
```

### Using axios

```js
async function fetchData() {
  const url = "https://express-proxy-3fa2dcca9dad.herokuapp.com/api?url=http://exampleapi.com/data";

  try {
    const response = await axios.get(url);
    console.log(response.data);
  } catch (error) {
    console.error("Error:", error);
  }
}

fetchData();
```

### Using Curl

```curl
curl "https://express-proxy-3fa2dcca9dad.herokuapp.com/api?url=http://exampleapi.com/data"
```
