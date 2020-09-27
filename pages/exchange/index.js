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


    this.state = {wallet:null,tezos:null,token:null,exchange:null,
      balance:0,tokenBal:0,publicKey:"",MintAmount:0,estimate:0,xtzPrice:0,
      MintButton:true,Counter:1,Dialog:false,
      xtzSupply:0,xtzSupplyButton:true,xtzAmount:0,xtzestimate:0,
      StableSupply:0,StableSupplyButton:true,StableAmount:0,StableEstimate:0,StableMutez:0};
   
  }

  componentDidMount()
  {
    this.WalletConfigure();
  
    this.timer = setInterval(()=> this.ValueUpdate(), 1000);
  }

  WalletConfigure = async() => {

    try 
    {

      await ThanosWallet.isAvailable();

      const wallet = new ThanosWallet("Vikalp Platform");
      await wallet.connect({
        name: "delphinet",
        rpc: "https://delphinet.smartpy.io",
      });
      
      const tezos = wallet.toTezos();
      
      const token = await tezos.wallet.at("KT1LE93y3jjtquCM6s3SAUbQtZSk7kfsJPoz");
      
      const exchange = await tezos.wallet.at("KT1GZ2Ms6w4H8MESHuBNxa4zkbjVpSRA7X7e");
      const  accountPkh = await tezos.wallet.pkh();

      this.setState({wallet:wallet,tezos:tezos,token:token,exchange:exchange,publicKey:accountPkh,MintButton:false});

      
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

        const response = await this.state.exchange.storage();
        
        const xtzSupply = response.xtzSupply.toNumber();
        const StableSupply = response.stableSupply.toNumber();

        this.setState({xtzSupply:xtzSupply,StableSupply:StableSupply});

        if(account != undefined)
        {
        
          const ALAToken = (account.balance.toNumber())/1000000;
          this.setState({balance:balance,tokenBal:ALAToken});
        }
        else{
          this.setState({balance:balance,tokenBal:0});
        }
        
      }
      
  }

  xtzSwap = async() => {

    if (this.state.exchange != null && this.state.xtzAmount > 0)
    {
          const operation = await this.state.token.methods.mint(this.state.MintAmount).send({amount:this.state.MintAmount});

          this.setState({Dialog:true});

          await operation.confirmation();
          
          this.setState({Dialog:false});
          console.log("Minted Token");
    }
    
      }
  
  xtzupdateAmount = async(amount)=>{
    
    amount = parseInt(amount);
    if (amount > 0 &&  amount < this.state.xtzSupply)
    {
      
      var difference = this.state.xtzSupply - amount; 
      const k = 2*(10**9); 
     
      var  payment = (Math.floor(k/difference) - this.state.StableSupply*1000)*1000 + amount*1000;

      console.log(`Payment: ${payment}`);  
      
      const token = payment/(10**6);

      console.log(`Token Amount: ${token}`);
      
      this.setState({xtzAmount:amount,xtzestimate:token});

      if(token < this.state.tokenBal)
      {
        this.setState({xtzSupplyButton:false});
      }
    }
    else {
      this.setState({xtzAmount:0,xtzestimate:0,xtzSupplyButton:true});
    }
    
  }

  StableupdateAmount = async(amount)=>{
    
    amount = parseInt(amount);
    
    if (amount > 0 &&  amount < this.state.StableSupply)
    {
      console.log("StableInput");

      var difference = this.state.StableSupply - amount; 
      const k = 2*(10**9); 
     
      var  payment = (Math.floor(k/difference) - this.state.xtzSupply*1000)*1000 + amount*1000;

      console.log(`Payment: ${payment}`);  
      
      const token = payment/(10**6);

      console.log(`Token Amount: ${token}`);
      
      this.setState({StableAmount:amount,StableEstimate:token,StableMutez:payment});
      
      if(token < this.state.balance)
      {
        this.setState({StableSupplyButton:false});
      }
    }
    else {
      this.setState({StableAmount:0,StableEstimate:0,StableSupplyButton:true,StableMutez:0});
    }
    
  }

  ChangeAccount = async() => {

    const available = await ThanosWallet.isAvailable();
    if(available)
    {
      var AppName = `Vikalp Account ${this.state.Counter}`; 

      const wallet = new ThanosWallet(AppName);
      await wallet.connect({
        name: "delphinet",
        rpc: "https://delphinet.smartpy.io",
      });
      
      const tezos = wallet.toTezos();
      
      const token = await tezos.wallet.at("KT1LE93y3jjtquCM6s3SAUbQtZSk7kfsJPoz");
      
      const exchange = await tezos.wallet.at("KT1GZ2Ms6w4H8MESHuBNxa4zkbjVpSRA7X7e");
      const  accountPkh = await tezos.wallet.pkh();
  
      this.setState({wallet:wallet,tezos:tezos,token:token,exchange:exchange,publicKey:accountPkh,MintButton:false,Counter:this.state.Counter+1});
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
                  Vikalp Platform Token Exchange
                </title>
              </Head>
              <AppBar position="fixed"  theme={theme}>
                <Toolbar>
                  <Link href="/dashboard">
                  <Typography variant="h6" className={useStyles.TypographyStyles}>
                    Vikalp
                  </Typography>
                  </Link>
                  <div style={{'marginLeft':'45%'}}>
                    <Link href="/dashboard/sellar">
                      <Typography variant="h6" className={useStyles.TypographyStyles}>
                        Insurance Dashboard
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
              <div style={{'marginTop':'8%'}}>
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
                  <Grid item xs = {1}>

                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Card variant="elevation">
                      <CardContent>
                          <Grid container spacing={2} direction="column" justify="center" alignItems="center" >
                            <Grid item xs={12} sm={12}>
                              <img src="/money.png"/>
                            </Grid>
                            <Grid item xs={12} sm={12}>
                              <TextField label="XTZ Amount" type="number" variant="outlined" onChange={(event)=>{this.xtzupdateAmount(event.target.value)}} />
                            </Grid>
                            <Grid item xs={12} sm={12}>
                              <Typography variant="body1">
                                Required Tokens: {this.state.xtzestimate} ALA Tokens
                              </Typography>
                            </Grid>
                            <Grid item xs={12} sm={12}>
                              <Button onClick={this.MintToken} variant="contained" color="primary" disabled={this.state.xtzSupplyButton}>Swap XTZ</Button>
                            </Grid>
                          </Grid>  
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs = {2} sm={2}>
                    <Grid container spacing={3} direction="column" justify="center" alignItems="center">
                      <Grid item sm={12}>

                      </Grid>
                      <Grid item sm={12}>
                      <img src="/money-transfer.png" />
                      </Grid>
                    
                    </Grid>
                    
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Card variant="elevation">
                      <CardContent>
                          <Grid container spacing={2} direction="column" justify="center" alignItems="center">
                            <Grid item xs={12} sm={12}>
                              <img src="/money.png"/>
                            </Grid>
                            <Grid item item xs={12} sm={12}>
                              <TextField label="ALA Token Amount" type="number" variant="outlined" onChange={(event)=>{this.StableupdateAmount(event.target.value)}} />
                            </Grid>
                            <Grid item xs={12} sm={12}>
                              <Typography variant="body1">
                                Amount: {this.state.StableEstimate} XTZ
                              </Typography>
                            </Grid>
                            <Grid item xs={12} sm={12}>
                              <Button onClick={this.xtzSwap} variant="contained" color="secondary" disabled={this.state.StableSupplyButton}>Swap ALA</Button>
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