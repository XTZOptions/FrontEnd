
import React,{Component} from 'react'; 
import {Button,Typography,Grid,AppBar, Toolbar,TextField} from '@material-ui/core';
import { ThemeProvider } from '@material-ui/core/styles';

import {makeStyles} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Slider from '@material-ui/core/Slider';

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

class InsuranceBody extends React.Component {

    constructor()
    {
        super();

        this.state = {duration:14,quantity:0,StrikeMap:{},StrikePrice:0,
        Premium:0,BreakEven:0,Ratio:100,BuyButton:true,Dialog:false,DialogHeading:""};
    }

    updateQuantity = (amount)=>{
    
        amount = parseInt(amount);
        if (amount > 0)
        {
            this.setState({quantity:amount});
            this.PremiumCal();
        }
        else {
            this.setState({quantity:0});
        }
        
    }

    DurationChange = (event,value) => {
  
        this.setState({duration:value});
        this.PremiumCal();
    }

    StrikeChange = (event,value) => {
        if(this.state.StrikeMap != undefined)
        {
            const response = (this.state.StrikeMap[value])/100;
            this.setState({StrikePrice:response,Ratio:value});
            this.PremiumCal();
        }
        else{
            this.setState({StrikePrice:0});
        }
        
    }

    PremiumCal =  async ()=> {

      if(this.state.StrikePrice > 0 && this.state.quantity > 0)
      {
        const Interest = {
          80:{
                7:0.01,14:0.02,21:0.04
        },
        90:{
          7:2,14:4,21:8
        },
        
        100:{
          7:0.04,14:0.08,21:0.16
        },
        110:{
          7:0.02,14:0.04,21:0.08
        },
        120:{
          7:0.01,14:0.02,21:0.04
        }};

        var amount = Interest[this.state.Ratio][this.state.duration];

        console.log(`StrikePrice ${this.state.StrikePrice}`);
        
        var premium = (this.state.StrikePrice*this.state.quantity*amount);
        console.log(`Premium ${amount}`);
  
        if (this.state.Ratio > 100) {premium += this.state.StrikePrice - (this.state.StrikeMap[100])/100; }
        
        this.setState({Premium:premium.toFixed(2)});
        this.BreakEvenPrice();
      }
      else{
        this.setState({Premium:0});
      }
    }

    BreakEvenPrice = async() => {
      if (this.state.Premium > 0 )
      {
        var amount = this.state.StrikePrice - this.state.Premium;
        console.log(amount);
        this.setState({BreakEven:amount.toFixed(2),BuyButton:false});
      }
    }

    BuySecurity = async() => {


    }

    handleClose = ()=> {
      this.setState({Dialog:false});
    }


    componentDidUpdate()
    {
        this.StrikePriceRange();
    }

    StrikePriceRange = async() => {
        if(this.props.oracle != null)
        {
            const response = await this.props.oracle.storage();

            var StrikeMap = {};
            StrikeMap[80] = response.StrikePrice.get('80').toNumber(); 
            StrikeMap[90] = response.StrikePrice.get('90').toNumber(); 
            StrikeMap[100] = response.StrikePrice.get('100').toNumber(); 
            StrikeMap[110] = response.StrikePrice.get('110').toNumber(); 
            StrikeMap[120] = response.StrikePrice.get('120').toNumber(); 
            
            this.setState({StrikeMap:StrikeMap});
        }
        
    }
    

    render()
    {
        return (
                    
                   <Grid container spacing={3}>
                       <Grid item xs={2}>
                       </Grid>
                       <Grid item xs={8}>
                        <Card variant="elevation">
                        <CardContent>
                            <Grid container spacing={3}>
                                <Grid item xs={2}>
                                <img src="/money.png"/>
                                </Grid>
                                <Grid item xs={4}>
                                <TextField label="Options Quantity" type="number" variant="outlined" onChange={(event)=>{this.updateQuantity(event.target.value)}} />
                                </Grid>
                                
                                <Grid item xs={5}>
                                <div style={{'marginTop':'2%'}}>
                                <Typography>
                                    Contract Duration : {this.state.duration} Days
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
                    <Grid item xs={2}>

                    </Grid>
                    <Grid item xs={8}>
                    <Card variant="elevation">
                      <CardContent>
                          <Grid container spacing={3}>
                            <Grid item xs={2}>
                              <img src="/bank.png"/>
                            </Grid>
                            <Grid item xs={4}>
                              <Typography variant="h6">
                               Strike Price: {this.state.StrikePrice} USD
                              </Typography>
                            </Grid>
                            <Grid item xs={5}>
                            <div style={{'marginTop':'2%'}}>
                              <Typography>
                               Strike Price Range:
                              </Typography>    
                              <Slider
                                  defaultValue={2}
                                  getAriaValueText={this.valuetext}
                                  aria-labelledby="discrete-slider"
                                  valueLabelDisplay="auto"
                                  step={10}
                                  marks
                                  min={80}
                                  max={120}
                                  onChange={this.StrikeChange}
                              />
                              </div>
                            </Grid>
                          </Grid>  
                      </CardContent>
                    </Card>
                    </Grid>
                    <Grid item xs={2}>

                    </Grid>
                    <Grid item xs={2}>

                    </Grid>
                    <Grid item xs={8}>
                    <Card variant="elevation">
                      <CardContent>
                          <Grid container spacing={3}>
                            <Grid item xs={2}>
                              <img src="/locked.png"/>
                            </Grid>
                            <Grid item xs={3}>
                              <Typography variant="h6">
                                Premium Amount: {this.state.Premium} USD
                              </Typography>
                            </Grid>
                            <Grid item xs={3}>
                              <Typography variant="h6">
                                Break Even Price:{this.state.BreakEven} USD
                              </Typography>
                            </Grid>
                            
                            <Grid item xs={4}>
                              <Button onClick={this.BuySecurity} variant="contained" color="primary" disabled={this.state.BuyButton}>Buy Security</Button>
                            </Grid>
                          </Grid>  
                      </CardContent>
                    </Card>
                  </Grid>
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

                   </Grid>
        )
    }
} 

export default InsuranceBody; 