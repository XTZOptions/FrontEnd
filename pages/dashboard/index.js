import React,{Component} from 'react'; 
import { ThanosWallet } from "@thanos-wallet/dapp";
import {Button,Typography,Grid,AppBar, Toolbar,TextField} from '@material-ui/core';
import { ThemeProvider } from '@material-ui/core/styles';
import theme from '../../components/navbar';
import {makeStyles} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Paper from '@material-ui/core/Paper';
import CardContent from '@material-ui/core/CardContent';


import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import CircularProgress from '@material-ui/core/CircularProgress';

import Link from 'next/link';
import Head from 'next/head';

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


    this.state = {wallet:null,tezos:null,token:null,oracle:null,
      balance:0,tokenBal:0,publicKey:"",MintAmount:0,estimate:0,xtzPrice:0,
      MintButton:true,Counter:1,Dialog:false};
   
  }

  componentDidMount()
  {
    this.WalletConfigure();
  
    this.timer = setInterval(()=> this.ValueUpdate(), 2000);
  }

  WalletConfigure = async() => {

    try 
    {

      await ThanosWallet.isAvailable();

      const wallet = new ThanosWallet("Vikalp Platform");
      await wallet.connect("carthagenet");
      
      const tezos = wallet.toTezos();
      
      const token = await tezos.wallet.at("KT1CdcfvT8uBu8ZorXhP4EVtf8VNdPLZmafg");
      
      const oracle = await tezos.wallet.at("KT1Jr3fu9roMBmzTdeHSTLNDJc9JkBiXbGd1");
      const  accountPkh = await tezos.wallet.pkh();

      this.setState({wallet:wallet,tezos:tezos,token:token,oracle:oracle,publicKey:accountPkh,MintButton:false});

      
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

        const response = await this.state.oracle.storage();
        const Price = response.xtzPrice.toNumber();
        
        if(account != undefined)
        {
        
          const ALAToken = account.balance.toNumber();
          this.setState({balance:balance,tokenBal:ALAToken,xtzPrice:Price});
        }
        else{
          this.setState({balance:balance,tokenBal:0,xtzPrice:Price});
        }
        
      }
      
  }

  MintToken = async() => {

      if (this.state.token != null && this.state.MintAmount > 0)
    {
          const operation = await this.state.token.methods.mint(this.state.publicKey,this.state.MintAmount).send({amount:this.state.MintAmount});

          this.setState({Dialog:true});
          await operation.confirmation();
          this.setState({Dialog:false});
          console.log("Minted Token");
    }
    
      }
  updateAmount = async(amount)=>{
    
    
    amount = parseInt(amount);
    if (amount > 0 && this.state.oracle != null)
    {
      const response = await this.state.oracle.storage();
      const Price = response.xtzPrice.toNumber();
      
      this.setState({MintAmount:amount,estimate:amount*Price*100,xtzPrice:Price});
    }
    else {
      this.setState({MintAmount:0,estimate:0});
    }
    
  }

  ChangeAccount = async() => {

    const available = await ThanosWallet.isAvailable();
    if(available)
    {
      var AppName = `Vikalp Account ${this.state.Counter}`; 

      const wallet = new ThanosWallet(AppName);
      await wallet.connect("carthagenet");
      
      const tezos = wallet.toTezos();
      
      const token = await tezos.wallet.at("KT1CdcfvT8uBu8ZorXhP4EVtf8VNdPLZmafg");
      
      const oracle = await tezos.wallet.at("KT1Jr3fu9roMBmzTdeHSTLNDJc9JkBiXbGd1");
      const  accountPkh = await tezos.wallet.pkh();
  
      this.setState({wallet:wallet,tezos:tezos,token:token,oracle:oracle,publicKey:accountPkh,MintButton:false,Counter:this.state.Counter+1});
    }
    
    

  }

  handleClose = ()=> {
    this.setState({Dialog:false});
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
              <Head>
                <title>
                  Vikalp Platform
                </title>
              </Head>
              <AppBar position="fixed"  theme={theme}>
                <Toolbar>
                  <Link href="/dashboard">
                  <Typography variant="h6" className={useStyles.TypographyStyles}>
                    Vikalp
                  </Typography>
                  </Link>
                  <div style={{'marginLeft':'25%'}}>
                    <Link href="/dashboard/sellar">
                      <Typography variant="h6" className={useStyles.TypographyStyles}>
                        Sell Security
                      </Typography>
                    </Link>
                  </div>
                  <div style={{'marginLeft':'5%'}}>
                    <Link href="/dashboard/buyer">
                      <Typography variant="h6" className={useStyles.TypographyStyles}>
                        Purchase Security
                      </Typography>
                    </Link>
                  </div>
                  <div style={{'marginLeft':'5%'}}>
                      <Typography variant="body1" className={useStyles.TypographyStyles}>
                        {this.state.publicKey.substring(0,7) + "..." + this.state.publicKey.substring(32,36)} 
                      </Typography>
                  </div>
                  <div style={{'marginLeft':'5%'}}>
                    <Button style={{'color':'white'}} variant="contained" color="primary" onClick={this.ChangeAccount}>
                        Change Account
                    </Button>
                  </div>
                </Toolbar>
              </AppBar>
              <div style={{'marginTop':'15%'}}>
              <ThemeProvider theme={theme}>
                <Grid container spacing={3}>
                  <Grid item xs={3} sm={2}>

                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Card variant="elevation">
                      <CardContent>
                        <Grid container spacing={1}>
                          <Grid item xs={4}>
                           <img src="/decentralized.png"/>
                          </Grid>
                          <Grid item xs={8}>
                           <Typography variant="h6" >
                              {this.state.balance} XTZ Token
                            </Typography>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Card variant="elevation">
                      <CardContent>
                      <Grid container spacing={1}>
                          <Grid item xs={4}>
                          <img src="/money.png"/>
                          </Grid>
                          <Grid item xs={8}>
                           <Typography variant="h6" >
                            {this.state.tokenBal} ALA Token
                            </Typography>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={2}>

                  </Grid>
                  <Grid item xs = {3}>

                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Card variant="elevation">
                      <CardContent>
                          <Grid container spacing={3}>
                            <Grid item xs={2}>
                              <img src="/money.png"/>
                            </Grid>
                            <Grid item xs={3}>
                              <TextField label="Mint" type="number" variant="outlined" onChange={(event)=>{this.updateAmount(event.target.value)}} />
                            </Grid>
                            <Grid item xs={4}>
                              <Typography variant="body1">
                                Tokens: {this.state.estimate} ALA
                                <br/>
                                <br/>
                                1 XTZ = {this.state.xtzPrice} ALA Tokens
                              </Typography>
                            </Grid>
                            <Grid item xs={3}>
                              <Button onClick={this.MintToken} variant="contained" color="primary" disabled={this.state.MintButton}>Mint Tokens</Button>
                            </Grid>
                          </Grid>  
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </ThemeProvider>
              </div>    
              
              <Dialog
                open={this.state.Dialog}
                onClose={this.handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                disableBackdropClick={true}
                disableEscapeKeyDown={true}
              >
              <DialogTitle id="alert-dialog-title">{"Minting ALA Tokens"}</DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  <div style={{'marginLeft':'35%'}}>
                    <CircularProgress/>
                  </div>
                </DialogContentText>
              </DialogContent>
            </Dialog>

            </div>
    )
  }

}