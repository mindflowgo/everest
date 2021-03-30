import React from "react"

function SellerForm() {
    return (
        <div>
            <div class="input-group mb-3">
                <span class="input-group-text" id="basic-addon1">Seller Name</span>
                <input type="text" class="form-control" placeholder="Seller Name" aria-label="Username" aria-describedby="basic-addon1" />
            </div>
            <div class="input-group mb-3">
                <span class="input-group-text" id="basic-addon1">Dog Name</span>
                <input type="text" class="form-control" placeholder="Dog Name" aria-label="Username" aria-describedby="basic-addon1" />
            </div>
            <div class="input-group mb-3">
                <span class="input-group-text" id="basic-addon1">Upload Picture</span>
                <input class="form-control" type="file" id="formFile" />
            </div>
            <div class="input-group mb-3">
                <span class="input-group-text" id="basic-addon1">Age</span>
                <input type="text" class="form-control" placeholder="Age" aria-label="Username" aria-describedby="basic-addon1" />
            </div>
            <div class="input-group mb-3">
                <span class="input-group-text" id="basic-addon1">Size:</span>
                <div class="form-check form-check-inline">
                    <input class="form-check-input" type="checkbox" id="inlineCheckbox1" value="option1" />
                    <label class="form-check-label" for="inlineCheckbox1">X-Small</label>
                </div>
                <div class="form-check form-check-inline">
                    <input class="form-check-input" type="checkbox"  value="option2" />
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
                    <input class="form-check-input" type="checkbox"  value="option2" />
                    <label class="form-check-label" >X-Large</label>
                </div>
            </div>
            <div class="input-group mb-3">
                <span class="input-group-text" id="basic-addon1">Breed</span>
                <input type="text" class="form-control" placeholder="Breed" aria-label="Username" aria-describedby="basic-addon1" />
            </div>
            <div class="input-group mb-3">
                <span class="input-group-text" id="basic-addon1">Price (CAD)</span>
                <input type="text" class="form-control" placeholder="Price" aria-label="Username" aria-describedby="basic-addon1" />
            </div>
            <div class="input-group mb-3">
                <span class="input-group-text" id="basic-addon1">Website (optional)</span>
                <input type="text" class="form-control" placeholder="Website" aria-label="Username" aria-describedby="basic-addon1" />
            </div>
            <div class="form-floating">
                <textarea class="form-control" placeholder="Leave a Description here" id="floatingTextarea2" style={{ height: "100px" }}></textarea>
                <label for="floatingTextarea2">Description</label>
            </div>
        </div>
    )
}

export default SellerForm