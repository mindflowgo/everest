import React from "react"
import RangeSlider from './RangeSlider';
function BuyerForm() {
    return (
        <div>

            <div class="input-group mb-3">
                <span class="input-group-text" id="basic-addon1">Minimum Price (Optional)</span>
                <input type="text" class="form-control" aria-label="Username" aria-describedby="basic-addon1" />
            </div>
            <div class="input-group mb-3">
                <span class="input-group-text" id="basic-addon1">Maximum Price (Optional)</span>
                <input type="text" class="form-control" aria-label="Username" aria-describedby="basic-addon1" />
            </div>
            <div class="input-group mb-3">
                <RangeSlider label="Age Range" />
            </div>

            <div class="input-group mb-3">
                <span class="input-group-text" id="basic-addon1">Size Preferences:</span>
                <div class="form-check form-check-inline">
                    <input class="form-check-input" type="checkbox" id="inlineCheckbox1" value="option1" />
                    <label class="form-check-label" for="inlineCheckbox1">X-Small</label>
                </div>
                <div class="form-check form-check-inline">
                    <input class="form-check-input" type="checkbox" value="option2" />
                    <label class="form-check-label" >Small</label>
                </div>
                <div class="form-check form-check-inline">
                    <input class="form-check-input" type="checkbox" value="option2" />
                    <label class="form-check-label">Medium</label>
                </div>
                <div class="form-check form-check-inline">
                    <input class="form-check-input" type="checkbox" value="option2" />
                    <label class="form-check-label" >Large</label>
                </div>
                <div class="form-check form-check-inline">
                    <input class="form-check-input" type="checkbox" value="option2" />
                    <label class="form-check-label" >X-Large</label>
                </div>
            </div>

        </div>
    )
}

export default BuyerForm