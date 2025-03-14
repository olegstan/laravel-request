Install

npm install laravel-request

Connected package

https://github.com/olegstan/laravel-rest

set domain resolver before any request

```
Api.domainResolver = () => {
    try {
        return Environment.get('REACT_APP_API_URL');
    } catch (e) {
        console.log(e)
        return null;
    }
}
```

set auth token resolver before any request

default token resolver, you can redefine it to any other
```
Api.tokenResolver = async () => {
    try {
        return await localStorage.getItem('api_token'); 
    } catch (e) {
        console.log(e)
        return null;
    }
}
```

Usage get data

```
Api.get('active-trade', 'index')
      .where('active_id', 115)
      .with('currency')
      .with('to_account', 'to_account.currency')
      .with('from_account', 'from_account.currency')
      .orderBy('trade_at', 'DESC')
      .all((response) => {
        //success
      }, () => {
        //error
      })
}}     
```
  
or

```
Api.get('active-trade', 'index')
      .where('id', 115)
      .with('currency')
      .with('to_account', 'to_account.currency')
      .with('from_account', 'from_account.currency')
      .orderBy('trade_at', 'DESC')
      .first((response) => {
        //success
        
      }, () => {
        //error
      })
}}
```

  
You can use

all or first or paginate

usage POST data

```
Api.post('active', 'store', {
      user_id: this.props.client.id,
      type: 2,
      type_id: item.type_id
    })
      .call((response) => {
        //success
      }, (response) => {
        //error
      });
```

response must be like below, for 200 status should contains key "result" with text "success"

{
    "meta": [],
    "result": "success",
    "data": [],
}

you can cancel request by

```

let cancelTokenSource = Api.get('active', SearchAllTypesHelper.ALL_TYPES, {
            item_search: searchQuery,
            user_id: clientId,
            search_stock: 1
        }).call(({data}) => {}, () => {}).getSource()
        
cancelTokenSource.cancel();
        
```
