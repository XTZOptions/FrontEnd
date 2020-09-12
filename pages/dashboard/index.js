import React,{Component} from 'react'; 
import axios from 'axios';
import { ThanosWallet } from "@thanos-wallet/dapp";
import {Button,Typography,Grid,AppBar, Toolbar,TextField} from '@material-ui/core';
import { ThemeProvider } from '@material-ui/core/styles';
import theme from '../../components/navbar';
import {makeStyles} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Paper from '@material-ui/core/Paper';
import CardContent from '@material-ui/core/CardContent';

import Link from 'next/link';


const useStyles = makeStyles({
    helloThereStyle:{
      fontStyle:'oblique'
    },
    TypographyStyles :{
      flex : 1, 
      fontStyle:'oblique'
    }
});

export default class extends Component {


  constructor()
  {
    super();


    this.state = {wallet:null,tezos:null,token:null,options:null,balance:0,tokenBal:0,
      publicKey:null,MintAmount:0,estimate:0};
   
  }

  componentDidMount()
  {
    this.WalletConfigure();
  
    this.timer = setInterval(()=> this.ValueUpdate(), 5000);
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
      const  accountPkh = await tezos.wallet.pkh();

      this.setState({wallet:wallet,tezos:tezos,token:token,options:options,publicKey:accountPkh});

      
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
        balance = parseFloat(balance);
        balance = balance.toFixed(2);
        const data = await this.state.token.storage();
        const account = await data.ledger.get(accountPkh);
        
        const ALAToken = account.balance.toNumber();
        
        this.setState({balance:balance,tokenBal:ALAToken});
      }
      
  }

  MintToken = async() => {

      if (this.state.token != null)
    {
          const operation = await this.state.token.methods.mint(this.state.publicKey,this.state.MintAmount).send({amount:this.state.MintAmount});
          await operation.confirmation();

          console.log("Minted Token");
    }
    
      }
  updateAmount = (amount)=>{
    
    console.log(amount);
    amount = parseInt(amount)
    this.setState({MintAmount:amount,estimate:amount*400})
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
              <AppBar position="fixed"  theme={theme}>
                <Toolbar>
                  <Typography variant="h6" className={useStyles.TypographyStyles}>
                    Options Platform
                  </Typography>
                  <div style={{'marginLeft':'45%'}}>
                    <Link href="/dashboard/sellar">
                      <Typography variant="h6" className={useStyles.TypographyStyles}>
                        Sell Options
                      </Typography>
                    </Link>
                  </div>
                  <div style={{'marginLeft':'5%'}}>
                    <Link href="/dashboard/buyer">
                      <Typography variant="h6" className={useStyles.TypographyStyles}>
                        Purchase Options
                      </Typography>
                    </Link>
                  </div>
                 
                  
                </Toolbar>
              </AppBar>
              <div style={{'marginTop':'15%'}}>
              <ThemeProvider theme={theme}>
                <Grid container spacing={3}>
                  <Grid item xs={3}>

                  </Grid>
                  <Grid item xs={3} >
                    <Card variant="elevation">
                      <CardContent>
                        <Typography variant="h6" >
                        <img src="decentralized.png"/>
                          {this.state.balance} XTZ Token
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={3}>
                    <Card variant="elevation">
                      <CardContent>
                        <Typography variant="h6" >
                          <img src="money.png"/>
                          {this.state.tokenBal} ALA Token
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={3}>

                  </Grid>
                  <Grid item xs = {3}>

                  </Grid>
                  <Grid item xs={6}>
                    <Card variant="elevation">
                      <CardContent>
                          <Grid container spacing={3}>
                            <Grid item xs={2}>
                              <img src="money.png"/>
                            </Grid>
                            <Grid item xs={3}>
                              <TextField label="Mint" type="number" variant="outlined" onChange={(event)=>{this.updateAmount(event.target.value)}} />
                            </Grid>
                            <Grid item xs={4}>
                              <Typography variant="h5">
                                Estimated Tokens: {this.state.estimate}
                              </Typography>
                            </Grid>
                            <Grid item xs={3}>
                              <Button onClick={this.MintToken} variant="contained" color="primary">Mint Tokens</Button>
                            </Grid>
                          </Grid>  
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </ThemeProvider>
              </div>
              
             
            </div>
    )
  }

}