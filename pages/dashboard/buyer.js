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

import InsuranceBody from '../../components/insurance';

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


    this.state = {wallet:null,tezos:null,token:null,options:null,balance:0,tokenBal:0,oracle:null,
      publicKey:"",Amount:0,estimate:0,
      poolSize:0,totalCapital:0,LockButton:true,CycleTime:null,
      xtzPrice:4,StrikePrice:0,Duration:14,Counter:1
    };
   
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
      const options = await tezos.wallet.at("KT1P62S4t8Z1XWHEXnFHcGjf2JHBSgQuHvGx");
      const oracle = await tezos.wallet.at("KT1HNFs395UNbBVnfQfj1SrEscJidqsScCZT");

      const  accountPkh = await tezos.wallet.pkh();

      this.setState({wallet:wallet,tezos:tezos,token:token,options:options,oracle:oracle,publicKey:accountPkh});

      
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
        
        const capital = (val.validation.totalSupply.toNumber())/10**6;
        
        const account = await data.ledger.get(accountPkh);
        
        const ALAToken = (account.balance.toNumber())/10**6;
      
        const optionsContract = await this.state.options.storage();
        
        this.setState({CycleTime:optionsContract.validation.cycleEnd});
        
        // const premium = await optionsContract.contractSellar.get(this.state.publicKey);
        
        
       
        this.setState({poolSize:val.poolSet.length,totalCapital:capital,tokenBal:ALAToken});
      
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
      const oracle = await tezos.wallet.at("KT1HNFs395UNbBVnfQfj1SrEscJidqsScCZT");
      
      
      const  accountPkh = await tezos.wallet.pkh();
  
      this.setState({wallet:wallet,tezos:tezos,token:token,options:options,oracle:oracle,publicKey:accountPkh,Counter:this.state.Counter+1});
      
    }

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
                  <div style={{'marginLeft':'25%'}}>
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
                              Total Liquidity :<br/>
                              {this.state.totalCapital} Tokens
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
                          <Grid item xs={4}>
                          <img src="/countdown.png"/>
                          </Grid>
                          <Grid item xs={8}>
                           <Typography variant="h6" >
                              Cycle End : <br/>
                              {this.state.CycleTime}
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
                          <img src="/money.png"/>
                          </Grid>
                          <Grid item xs={8}>
                           <Typography variant="h6" >
                            Personal Balance : <br/>
                            {this.state.tokenBal} Tokens
                            </Typography>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs = {1}>
                  </Grid>
                  <div style={{"marginBottom":"10%"}}>

                  </div>
                  <InsuranceBody 

                    wallet={this.state.wallet}
                    tezos={this.state.tezos}
                    token={this.state.token}
                    options={this.state.options}
                    oracle={this.state.oracle}

                    tokenBalance={this.state.tokenBal}
                  
                  
                  />      
                </Grid>
              </ThemeProvider>
              </div>             
            </div>  
    )
  }

}