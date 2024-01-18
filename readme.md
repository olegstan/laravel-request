Install

npm install laravel-request

Connected package

https://github.com/olegstan/laravel-rest


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

