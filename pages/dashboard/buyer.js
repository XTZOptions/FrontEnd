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


    this.state = {wallet:null,tezos:null,token:null,options:null,balance:0,tokenBal:0,
      publicKey:null,Amount:0,estimate:0,
      poolSize:0,totalCapital:0,premium:0,
      PremiumButton:true,SupplyButton:true,
      LockAmount:0,LockButton:true,CycleTime:null
    };
    
   
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
      const wallet = new ThanosWallet("Vikalp Platform");
      await wallet.connect("carthagenet");
      const tezos = wallet.toTezos();
      const token = await tezos.wallet.at("KT1KtyJeL78tdHnzwCPE8M14WDb1zqsnLkjQ");
      const options = await tezos.wallet.at("KT1Wo8GDGJgzgZWmRXWfpWpEhho8wUPp9eAR");
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
        
        const capital = val.validation.totalSupply.toNumber();
        
        const account = await data.ledger.get(accountPkh);
        
        const ALAToken = account.balance.toNumber();
      
        const optionsContract = await this.state.options.storage();
        
        this.setState({CycleTime:optionsContract.validation.cycleEnd});
        
        const premium = await optionsContract.contractSellar.get(this.state.publicKey);
        
        
        if (premium != undefined )
        {
          if (premium.premium.toNumber() > 0 )
          {
            this.setState({premium:premium.premium.toNumber(),PremiumButton:false});
          }
          else
          {
            this.setState({premium:0,PremiumButton:true});
          }
          this.setState({LockAmount:premium.amount.toNumber()});
        }
        else {
          console.log("Undefined State");
        }
        
        this.setState({poolSize:val.poolSet.length,totalCapital:capital});
      
      }
      
  }

  AddToken = async() => {

      if (this.state.token != null)
    {
          const operation = await this.state.options.methods.putSeller(this.state.Amount).send();
          await operation.confirmation();

          console.log("Added Supply");
    }
    
      }

  EarnPremium = async() => {

    if (this.state.token != null)
    {
        // const operation = await this.state.options.methods.WithdrawPremium().send();
        // await operation.confirmation();
    }

  }

  EarnPremium = async() => {
    if(this.state.token != null)
    {
        // const operation = await this.state.options.methods.WithdrawPremium().send();
        // await operation.confirmation();
    }
  }

  ChangeAccount = async() => {
    const available = await ThanosWallet.isAvailable();
    if(available)
    {
      console.log("Available");
      var wallet = new ThanosWallet("My Super DApp");
      await wallet.connect("carthagenet");
      var tezos = wallet.toTezos();
      
      wallet = null; 
      tezos = null ;
      
    }

  }
  updateAmount = (amount)=>{
    
    console.log(amount);
    amount = parseInt(amount)
    this.setState({Amount:amount})
  }

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
                  <div style={{'marginLeft':'45%'}}>
                    <Link href="/dashboard">
                      <Typography variant="h6" className={useStyles.TypographyStyles}>
                        Dashboard
                      </Typography>
                    </Link>
                  </div>
                  <div style={{'marginLeft':'5%'}}>
                    <Link href="/dashboard/sellar">
                      <Typography variant="h6" className={useStyles.TypographyStyles}>
                        Sell Security
                      </Typography>
                    </Link>
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
                              {this.state.totalCapital} Total Liquidity 
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
                            {this.state.poolSize} Liquidity Providers
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
                              <Typography variant="h5">
                                Premium Earned: {this.state.premium}
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
                              <Typography variant="h5">
                                Locked Amount: {this.state.LockAmount}
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
            </div>  
    )
  }

}