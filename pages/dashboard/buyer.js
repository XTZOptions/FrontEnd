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
import Slider from '@material-ui/core/Slider';

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
      PremiumButton:true,LockAmount:0,LockButton:true,CycleTime:null,
      xtzPrice:4,StrikePrice:0,Duration:0
    };
   
  }
  valuetext = (value)=>{

    return `${value} Week`;
  }

  DurationChange = (event,value) => {
  
    this.setState({Duration:value});
    console.log(value);
  
  }

  StrikePriceChange = (event,value) => {
    
    this.setState({StrikePrice:value});
    console.log(value);
  
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
        const val = await this.state.options.storage();
        
        const capital = val.validation.totalSupply.toNumber();
        
        const account = await data.ledger.get(accountPkh);
        
        const ALAToken = account.balance.toNumber();
      
        const optionsContract = await this.state.options.storage();
        
        this.setState({CycleTime:optionsContract.validation.cycleEnd});
        
        const premium = await optionsContract.contractSellar.get(this.state.publicKey);
        
        
       
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
    
    amount = parseInt(amount);
    if (amount > 0)
    {
      console.log(amount);
      this.setState({Amount:amount});
    }
    this.setState({Amount:0});
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
                  <Grid item xs = {2}>
                  </Grid>
                  <Grid item xs={8}>
                    <Card variant="elevation">
                      <CardContent>
                          <Grid container spacing={3}>
                            <Grid item xs={2}>
                              <img src="/money.png"/>
                            </Grid>
                            <Grid item xs={4}>
                              <TextField label="Options Quantity" type="number" variant="outlined" onChange={(event)=>{this.updateAmount(event.target.value)}} />
                            </Grid>
                            
                            <Grid item xs={5}>
                              <div style={{'marginTop':'2%'}}>
                              <Typography>
                                Contract Duration : {this.state.Duration} Days
                              </Typography>
                             
                              <Slider
                                  defaultValue={14}
                                  getAriaValueText={this.valuetext}
                                  aria-labelledby="discrete-slider"
                                  valueLabelDisplay="auto"
                                  step={7}
                                  marks
                                  min={7}
                                  max={21}
                                  onChange={this.DurationChange}
                              />
                              </div>
                            </Grid>
                          </Grid>  
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid item xs={2}>
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
                            <Grid item xs={4}>
                              <Typography variant="h5">
                               Strike Price
                              </Typography>
                            </Grid>
                            <Grid item xs={5}>
                            <div style={{'marginTop':'2%'}}>
                              <Typography>
                                XTZ Price (in USD) : {this.state.StrikePrice} USD
                              </Typography>    
                              <Slider
                                  defaultValue={2}
                                  getAriaValueText={this.valuetext}
                                  aria-labelledby="discrete-slider"
                                  valueLabelDisplay="auto"
                                  step={this.state.xtzPrice*0.05}
                                  marks
                                  min={this.state.xtzPrice*0.90}
                                  max={this.state.xtzPrice*1.10}
                                  onChange={this.StrikePriceChange}
                              />
                              </div>
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
                                Break Even Price: {this.state.LockAmount}
                              </Typography>
                            </Grid>
                            <Grid item xs={4}>
                              <Button onClick={this.EarnAmount} variant="contained" color="primary" disabled={this.state.LockButton}>Buy Security</Button>
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