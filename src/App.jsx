import { useState } from 'react'
import {InputBox} from './components'
import useCurrencyInfo from './hooks/useCurrencyInfo'
import CurrencyGraph from './components/CurrencyGraph';

function App() {

  const [amount, setAmount] = useState(0)
  const [from, setFrom] = useState("usd")
  const [to, setTo] = useState("inr")
  const [convertedAmount, setConvertedAmount] = useState(0)

  const currencyInfo = useCurrencyInfo(from)

  const options = Object.keys(currencyInfo)

  const swap = () => {
    setFrom(to)
    setTo(from)
    setConvertedAmount(amount)
    setAmount(convertedAmount)
  }
  
  const convert = () => {
    setConvertedAmount(amount * currencyInfo[to])
  }

  return (
    <div
        className="w-full min-h-screen flex flex-col justify-center items-center bg-cover bg-no-repeat bg-fixed"
        style={{
            backgroundImage: `url('https://images.pexels.com/photos/3532540/pexels-photo-3532540.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')`,
        }}
    >
        {/* Main Container */}
        <div className="w-full flex flex-col items-center px-4 py-8 md:py-12">
            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-8 drop-shadow-lg">
                💱 Currency Converter
            </h1>

            {/* Converter Card */}
            <div className="w-full max-w-md mx-auto border border-white/40 rounded-xl p-6 backdrop-blur-md bg-white/20 shadow-2xl">
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        convert()
                       
                    }}
                >
                    <div className="w-full mb-4">
                        <InputBox
                            label="From"
                            amount={amount}
                            currencyOptions={options}
                            onCurrencyChange={(currency) => setFrom(currency)}
                            selectCurrency={from}
                            onAmountChange={(amount) => setAmount(amount)}
                        />
                    </div>
                    <div className="relative w-full h-0.5 mb-4">
                        <button
                            type="button"
                            className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 border-2 border-white rounded-md bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-1 font-semibold hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                            onClick={swap}
                        >
                            ⇅ Swap
                        </button>
                    </div>
                    <div className="w-full mb-6">
                        <InputBox
                            label="To"
                            amount={convertedAmount}
                            currencyOptions={options}
                            onCurrencyChange={(currency) => setTo(currency)}
                            selectCurrency={to}
                            amountDisable
                        />
                    </div>
                    <button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 hover:from-blue-600 hover:to-blue-700">
                        Convert {from.toUpperCase()} to {to.toUpperCase()}
                    </button>
                </form>
            </div>

            {/* Graph Section */}
            <div className="w-full">
                <CurrencyGraph currency={from} toCurrency={to} />
            </div>
        </div>
    </div>
);
}

export default App