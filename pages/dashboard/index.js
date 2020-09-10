import React,{Component} from 'react'; 
import axios from 'axios';
import { ThanosWallet } from "@thanos-wallet/dapp";

//import * from '../../components/navbar';

export default class extends Component {


  constructor()
  {
    super();


    this.state = {wallet:null,tezos:null,token:null,options:null,balance:0,tokenBal:0};
   
  }

  componentDidMount()
  {
    this.WalletConfigure();
    this.ValueUpdate();
    this.timer = setInterval(()=> this.ValueUpdate(), 10000);
  }

  WalletConfigure = async() => {

    try 
    {

      await ThanosWallet.isAvailable();
      const wallet = new ThanosWallet("Shopping Dapp");
      await wallet.connect("carthagenet");
      const tezos = wallet.toTezos();
      const token = await tezos.wallet.at("KT1KtyJeL78tdHnzwCPE8M14WDb1zqsnLkjQ");
      const options = await tezos.wallet.at("KT1Wo8GDGJgzgZWmRXWfpWpEhho8wUPp9eAR");
      

      this.setState({wallet:wallet,tezos:tezos,token:token,options:options});

      
    }
    catch(e)
    {
      console.log(e , 'Error');
    }

  }


  ValueUpdate =  async() => {

      if (this.state.wallet != null)
      {

        const  accountPkh = await this.state.tezos.wallet.pkh();
        const  amount = await this.state.tezos.tz.getBalance(accountPkh);

        var balance =  this.state.tezos.format('mutez','tz',amount).toString();
        balance = parseInt(balance);
        const data = await this.state.token.storage();
        const account = await data.ledger.get(accountPkh);
        
        const ALAToken = account.balance.toNumber();
        
        this.setState({balance:balance,tokenBal:ALAToken});
      }
      
  }

  // static async getInitialProps(){
    
  //   const response = await axios.get("https://api.coinbase.com/v2/prices/XTZ-USD/sell");
  //   const Amount = parseInt(response.data.data.amount*100)
  //   console.log(Amount);

  //   return {
  //     Price: Amount
  //   }
  // }


  render(){

    return (
            <div>
              <h2>
                Heading From React Component
              </h2>
              <h4>
                XTZ Balance : {this.state.balance}
              </h4>
              <h4>
                ALA Token : {this.state.tokenBal}
              </h4>
              <h4>
              
              </h4>
            </div>
    )
  }

}