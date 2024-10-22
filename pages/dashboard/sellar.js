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


    this.state = {
      wallet:null,tezos:null,token:null,options:null,balance:0,tokenBal:0,
      publicKey:"",Amount:0,poolSize:0,totalCapital:0,premium:0,
      PremiumButton:true,SupplyButton:true,
      LockAmount:0,LockButton:true,CycleTime:null,Counter:1,
      Dialog:false,DialogHeading:""
    };
    
   
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
      await wallet.connect({
        name: "delphinet",
        rpc: "https://delphinet.smartpy.io",
      });
      const tezos = wallet.toTezos();

      const token = await tezos.wallet.at("KT1LE93y3jjtquCM6s3SAUbQtZSk7kfsJPoz");
      const options = await tezos.wallet.at("KT1P62S4t8Z1XWHEXnFHcGjf2JHBSgQuHvGx");
      
      const  accountPkh = await tezos.wallet.pkh();

      this.setState({wallet:wallet,tezos:tezos,token:token,options:options,publicKey:accountPkh,SupplyButton:false});

      
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
        const val = await this.state.options.storage();
        
        const capital = (val.validation.totalSupply.toNumber())/1000000;
        
        const account = await data.ledger.get(accountPkh);
        
        if(account != undefined)
        {
        
          const ALAToken = (account.balance.toNumber())/1000000;
          this.setState({balance:balance,tokenBal:ALAToken});
        }
        else{
          this.setState({balance:balance,tokenBal:0});
        }

        const ALAToken = account.balance.toNumber();
      
        const optionsContract = await this.state.options.storage();
        
        this.setState({CycleTime:optionsContract.validation.cycleEnd});
        
        try {
          
            const premium = await optionsContract.contractSellar.get(this.state.publicKey);
            
            if (premium != undefined )
            {
              if (premium.premium.toNumber() > 0 )
              {
                this.setState({premium:(premium.premium.toNumber())/1000000,PremiumButton:false});
              }
              else
              {
                this.setState({premium:0,PremiumButton:true});
              }

              this.setState({LockAmount:(premium.amount.toNumber())/1000000});
            }
            else {
              this.setState({LockAmount:0,premium:0,PremiumButton:true})
              console.log("Undefined State");
            }

        } catch (error) {
          
          console.log("Value not present");
        }
        
        
        this.setState({poolSize:val.poolSet.length,totalCapital:capital});
      
      }
      
  }

  AddToken = async() => {

      if (this.state.token != null && this.state.Amount > 0 )
    {
          
          const operation = await this.state.options.methods.putSeller(this.state.Amount*1000000).send();
          this.setState({Dialog:true,DialogHeading:"Add Supply to Contract"});
          
          await operation.confirmation();
          this.setState({Dialog:false});

          console.log("Added Supply");
    }

      console.log("Input Error");
    
      }

  EarnPremium = async() => {

    if (this.state.token != null)
    {
        
        const operation = await this.state.options.methods.WithdrawPremium(1).send();
        this.setState({Dialog:true,DialogHeading:"Withdrawing Premium"});
          
        await operation.confirmation();
        this.setState({Dialog:false});
    }

  }

  EarnAmount = async() => {
    if(this.state.token != null)
    {
        const operation = await this.state.options.methods.WithdrawToken(1).send();
        this.setState({Dialog:true,DialogHeading:"Withdrawing TotalAmount"});
          
        await operation.confirmation();
        this.setState({Dialog:false});
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
    const options = await tezos.wallet.at("KT1P62S4t8Z1XWHEXnFHcGjf2JHBSgQuHvGx");
    
    const  accountPkh = await tezos.wallet.pkh();

    this.setState({wallet:wallet,tezos:tezos,token:token,options:options,publicKey:accountPkh,SupplyButton:false,Counter:this.state.Counter+1});
      
    }

  }
  updateAmount = (amount)=>{
    
    console.log(amount);
    amount = parseInt(amount)
    if(amount > 0 )
    {
      this.setState({Amount:amount})

      if(amount > this.state.tokenBal)
      {
        this.setState({SupplyButton:true});
      }
      else{
        this.setState({SupplyButton:false});
      }
    }
    
  }

  handleClose = ()=>  {

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
                  Vikalp Options Platform
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
                    <Link href="/dashboard">
                      <Typography variant="h6" className={useStyles.TypographyStyles}>
                        Dashboard
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
              <div style={{'marginTop':'6%'}}>
              <ThemeProvider theme={theme}>
                <Grid container spacing={3}>
                  <Grid item xs={1}>

                  </Grid>
                  <Grid item xs={3} >
                    <Card variant="elevation">
                      <CardContent>
                        <Grid container spacing={1}>
                          <Grid item xs={4}>
                           <img src="/economic.png"/>
                          </Grid>
                          <Grid item xs={8}>
                           <Typography variant="h6" >
                              Liquidity: {this.state.totalCapital.toFixed(2)} USDY Tokens 
                            </Typography>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={3}>
                    <Card variant="elevation">
                      <CardContent>
                      <Grid container spacing={1}>
                          <Grid item xs={4}>
                          <img src="/group.png"/>
                          </Grid>
                          <Grid item xs={8}>
                           <Typography variant="h6" >
                             Liquidity Providers: {this.state.poolSize}
                            </Typography>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={4}>
                  <Card variant="elevation">
                      <CardContent>
                      <Grid container spacing={1}>
                          <Grid item xs={3}>
                          <img src="/countdown.png"/>
                          </Grid>
                          <Grid item xs={9}>
                           <Typography variant="h6" >
                            Cycle End :{this.state.CycleTime} 
                            </Typography>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs = {3}>

                  </Grid>
                  <Grid item xs={6}>
                    <Card variant="elevation">
                      <CardContent>
                          <Grid container spacing={3}>
                            <Grid item xs={2}>
                              <img src="/money.png"/>
                            </Grid>
                            <Grid item xs={6}>
                              <TextField label="Increase Pool Supply" type="number" variant="outlined" onChange={(event)=>{this.updateAmount(event.target.value)}} />
                            </Grid>
                            
                            <Grid item xs={4}>
                              <Button onClick={this.AddToken} variant="contained" color="primary" disabled={this.state.SupplyButton}>Increase Supply</Button>
                            </Grid>
                          </Grid>  
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
                              <img src="/bank.png"/>
                            </Grid>
                            <Grid item xs={6}>
                              <Typography variant="h6">
                                Premium Earned: {this.state.premium.toFixed(3)} USDY Tokens
                              </Typography>
                            </Grid>
                            <Grid item xs={4}>
                              <Button onClick={this.EarnPremium} variant="contained" color="secondary" disabled={this.state.PremiumButton}>Withdraw Premium</Button>
                            </Grid>
                          </Grid>  
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
                              <img src="/locked.png"/>
                            </Grid>
                            <Grid item xs={6}>
                              <Typography variant="h6">
                                Locked Amount: {this.state.LockAmount.toFixed(2)} USDY Tokens
                              </Typography>
                            </Grid>
                            <Grid item xs={4}>
                              <Button onClick={this.EarnAmount} variant="contained" color="primary" disabled={this.state.LockButton}>Withdraw Amount</Button>
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
              <DialogTitle id="alert-dialog-title">{this.state.DialogHeading}</DialogTitle>
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