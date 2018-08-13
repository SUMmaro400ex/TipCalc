import React from 'react';
import { StyleSheet, Text, View, Animated, TextInput, Slider } from 'react-native';

export default class App extends React.Component {
  state = {
    step: 'bill',
    bill: '0',
    people: '',
    gratuity: 18,
    flexValues: {
      bill: new Animated.Value(6),
      people: new Animated.Value(1),
      gratuity: new Animated.Value(1),
      result: new Animated.Value(1)
    },
  }
  get formattedTotal() { return this.total.toFixed(2) }
  get total() { return +this.state.bill/100 }
  get totalPerPerson() { return (this.total/this.people).toFixed(2) }
  get tip() { return this.total * (this.state.gratuity / 100.0) }
  get tipPerPerson() { return (this.tip/this.people).toFixed(2) }
  get people() { return +this.state.people || 1 }
  get totalBill() { return +((this.total + this.tip)/this.people).toFixed(2) }
  isOpen = step => this.state.step === step;
  onTouch = nextStep => _ => {
    if (this.isOpen(nextStep)) return;
    this.animateTransition({ nextStep, currentStep: this.state.step });
    this.setState({ step: nextStep });
  }
  animateTransition = ({ nextStep, currentStep }) => {
    Animated.parallel([
      Animated.timing(
        this.state.flexValues[nextStep],
        {
          toValue: 5,
          duration: 400,
        }
      ),
      Animated.timing(
        this.state.flexValues[currentStep],
        {
          toValue: 1,
          duration: 400,
        }
      ),
    ]).start();
  }

  render() {
    const { flexValues, gratuity } = this.state;
    return (
      <View style={styles.container}>
        <Animated.View 
          style={[styles.section, styles.bill, { flex: flexValues.bill }]}
          onTouchEnd={this.onTouch('bill')}
        >
          <Text style={[styles.text, { paddingTop: 35 }]}>
            {this.isOpen('bill') ? 'Bill Total': `Bill $${this.formattedTotal}`}
          </Text>
          {
            this.isOpen('bill') &&
            (
              <React.Fragment>
                <TextInput
                  onChangeText={bill => this.setState({ bill: bill || '0' })}
                  style={styles.billInput}
                  value={this.state.bill}
                  keyboardType="number-pad"
                  returnKeyType="done"
                  onSubmitEditing={this.onTouch('people')}
                  autoFocus={true}
                />
                <Text style={styles.text}>
                  {`$${this.formattedTotal}`}
                </Text>
              </React.Fragment>
            )
          }
        </Animated.View>
        <Animated.View 
          style={[styles.section, styles.people, { flex: flexValues.people }]}
          onTouchEnd={this.onTouch('people')}
        >
            {
              this.isOpen('people') ?
              (
                <React.Fragment>
                  <TextInput
                    onChangeText={people => this.setState({ people })}
                    value={this.state.people}
                    placeholder='1'
                    style={styles.textMask}
                    keyboardType="number-pad"
                    returnKeyType="done"
                    onSubmitEditing={this.onTouch('gratuity')}
                    selectionColor="#F06292"
                    autoFocus={true}
                  />
                  <Text style={styles.text}>
                    {`${this.people === 1 ? 'Person' : 'People'} Paying`}
                  </Text>
                </React.Fragment>
              )
              :
              (
                <Text style={styles.text}>
                  {`${this.people} ${this.people === 1 ? 'Person' : 'People'} Paying`}
                </Text>
              )
            }
        </Animated.View>
        <Animated.View
          style={[styles.section, styles.gratuity, { flex: flexValues.gratuity }]}
          onTouchEnd={this.onTouch('gratuity')}
        >
          <Text style={styles.text}>
            {`Tip ${gratuity}%`}
          </Text>
          {
            this.isOpen('gratuity') &&
            <Slider 
              minimumValue={10}
              maximumValue={25}
              step={1}
              onValueChange={gratuity => this.setState({ gratuity })}
              style={{ width: 300}}
              value={this.state.gratuity}
              minimumTrackTintColor="#4FC3F7"
            />
          }
        </Animated.View>
        <Animated.View
          style={[styles.section, styles.result, { flex: flexValues.result }]}
          onTouchEnd={this.onTouch('result')}
        >
        {
          this.isOpen('result') ?
          (
            <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
              <View style={styles.resultSection}>
                <Text style={styles.text}>Bill</Text>
                <Text style={styles.text}>{`$${this.totalPerPerson}`}</Text>
              </View>
              <View style={styles.resultSection}>
                <Text style={styles.text}>Tip</Text>
                <Text style={styles.text}>{`$${this.tipPerPerson}`}</Text>
              </View>
              <Text style={[styles.text, { marginTop: -30 }]}>{`______________`}</Text>
              <View style={styles.resultSection}>
                <Text style={styles.text}>Total</Text>
                <Text style={styles.text}>{`$${this.totalBill.toFixed(2)}`}</Text>
              </View>
            </View>
          )
          :
          <Text style={styles.text}>{`Total $${this.totalBill.toFixed(2)}`}</Text>
        }
        </Animated.View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  bill: { backgroundColor: '#039BE5' },
  people: { backgroundColor: '#F06292' },
  gratuity: { backgroundColor: '#263238' },
  result: { backgroundColor: '#BA68C8' },
  section: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  text: { color: 'white', fontSize: 40, textAlign: 'center'},
  textMask: { fontSize: 50, color: 'white', textAlign: 'center', alignSelf: 'stretch' },
  resultSection: { width: 250, justifyContent: 'space-between', flexDirection: 'row'},
  billInput: { opacity: 0, height: 0},
});