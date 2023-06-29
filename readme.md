Usage get data

```
Api.get('active-trade', 'index')
      .where('active_id', 115)
      .with('currency')
      .with('to_account', 'to_account.currency')
      .with('from_account', 'from_account.currency')
      .orderBy('trade_at', 'DESC')
      .all((response) => {
        
      })
      .bind(this, 'trades')
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