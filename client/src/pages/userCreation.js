import React, { useEffect, useState } from "react"
import { useStoreContext } from '../utils/GlobalStore'
import SellerForm from '../components/SellerForm'
import BuyerForm from '../components/BuyerForm'

function UserCreation(props) {
    const [userStatus, setUserStatus] = useState("")

    function setSeller() {
        if (userStatus !== "Seller") {
            setUserStatus("Seller")
        }
    }

    function setBuyer() {
        if (userStatus !== "Buyer") {
            setUserStatus("Buyer")
        }
    }
    function buildBody() {
        switch (userStatus) {
            case "":
                return
            case "Seller":
                return <SellerForm />
            case "Buyer":
                return <BuyerForm />
        }
    }
    return (
        <div>
            <div class="form-check">
                <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" onClick={setBuyer} />
                <label className="form-check-label" for="flexRadioDefault1">
                    Buying
                </label>
            </div>
            <div className="form-check">
                <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" onClick={setSeller} />
                <label className="form-check-label" for="flexRadioDefault2">
                    Selling
                </label>
            </div>
            {buildBody()}
        </div>

    )
}

export default UserCreation