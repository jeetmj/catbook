function get(endpoint, queryVar, queryVal) {
  return new Promise(function(resolve, reject) {
    xhr = new XMLHttpRequest();
    fullPath = endpoint + '?' + queryVar + '=' + queryVal;
    xhr.open('GET', fullPath, true);
    xhr.onload = function(err) {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          resolve(JSON.parse(xhr.responseText));
        } else {
          reject(xhr.statusText);
        }
      }
    };
    xhr.onerror = function(err) {
      reject(xhr.statusText);
    }
    xhr.send(null);
  });
}

function post(endpoint, params) {
  return new Promise(function(resolve, reject) {
    xhr = new XMLHttpRequest();
    xhr.open('POST', endpoint, true);
    xhr.setRequestHeader('Content-type', 'application/json');
    xhr.withCredentials = true;
    xhr.onload = function(err) {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          resolve(JSON.parse(xhr.responseText));
        } else {
          reject(xhr.statusText);
        }
      }
    };
    xhr.onerror = function(err) {
      reject(xhr.statusText);
    };
    data = JSON.stringify(params);
    xhr.send(data);
  });
}
