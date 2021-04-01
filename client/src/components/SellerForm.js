import React, { useRef, useState } from 'react'
import fetchJSON from '../utils/API'
import { useStoreContext } from '../utils/GlobalStore'
function SellerForm() {
    const [uploadImage, setUploadImage] = useState()
    const [prefSize, setPrefSize] =useState()
    const [{ id }, dispatch ]= useStoreContext()
    const sellerName = useRef()
    const dogName = useRef()
    const dogAge = useRef()
    const dogBreed = useRef()
    const dogPrice = useRef()
    const website = useRef()
    const description = useRef()

    function updateImage() {

        if (document.getElementById("formFile").files.length > 0) {
           const uploaded = document.getElementById("formFile").files[0]
           setUploadImage(uploaded)
        } else {
            setUploadImage()
        }
    }

    async function submitSeller() {

        const seller = {
            dogName: dogName.current.value,
            // image: response.data.link,
            age: Number(dogAge.current.value),
            size: prefSize,
            breed: dogBreed.current.value,
            price: Number(dogPrice.current.value),
            website: website.current.value,
            description: description.current.value
        }
        const result = await fetchJSON(`/api/users/sellers/${id}`, 'put', seller )
    }
    return (
        <div>
            <div class="input-group mb-3">
                <span class="input-group-text" id="basic-addon1">Seller Name</span>
                <input type="text" class="form-control" placeholder="Seller Name" aria-label="Username" aria-describedby="basic-addon1" ref={sellerName}/>
            </div>
            <div class="input-group mb-3">
                <span class="input-group-text" id="basic-addon1">Dog Name</span>
                <input type="text" class="form-control" placeholder="Dog Name" aria-label="Username" aria-describedby="basic-addon1" ref={dogName}/>
            </div>
            <div class="input-group mb-3">
                <span class="input-group-text" id="basic-addon1">Upload Picture</span>
                <input class="form-control" type="file" id="formFile" accept="image/png, image/jpeg" onChange={updateImage} />
            </div>
            <div class="input-group mb-3">
                <span class="input-group-text" id="basic-addon1">Age</span>
                <input type="text" class="form-control" placeholder="Age" aria-label="Username" aria-describedby="basic-addon1" ref={dogAge} />
            </div>
            <div class="input-group mb-3">
                <span class="input-group-text" id="basic-addon1">Size:</span>
                <div class="form-check form-check-inline">
                    <input class="form-check-input" type="checkbox" id="inlineCheckbox1" value="option1" onClick={() => setPrefSize('xSmall')}/>
                    <label class="form-check-label" for="inlineCheckbox1">X-Small</label>
                </div>
                <div class="form-check form-check-inline">
                    <input class="form-check-input" type="checkbox" value="option2" onClick={() => setPrefSize('small')}/>
                    <label class="form-check-label" >Small</label>
                </div>
                <div class="form-check form-check-inline">
                    <input class="form-check-input" type="checkbox" value="option2" onClick={() => setPrefSize('medium')}/>
                    <label class="form-check-label">Medium</label>
                </div>
                <div class="form-check form-check-inline">
                    <input class="form-check-input" type="checkbox" value="option2" onClick={() => setPrefSize('large')}/>
                    <label class="form-check-label" >Large</label>
                </div>
                <div class="form-check form-check-inline">
                    <input class="form-check-input" type="checkbox" value="option2" onClick={() => setPrefSize('xLarge')} />
                    <label class="form-check-label" >X-Large</label>
                </div>
            </div>
            <div class="input-group mb-3">
                <span class="input-group-text" id="basic-addon1">Breed</span>
                <input type="text" class="form-control" placeholder="Breed" aria-label="Username" aria-describedby="basic-addon1" ref={dogBreed}/>
            </div>
            <div class="input-group mb-3">
                <span class="input-group-text" id="basic-addon1">Price (CAD)</span>
                <input type="text" class="form-control" placeholder="Price" aria-label="Username" aria-describedby="basic-addon1" ref={dogPrice}/>
            </div>
            <div class="input-group mb-3">
                <span class="input-group-text" id="basic-addon1">Website (optional)</span>
                <input type="text" class="form-control" placeholder="Website" aria-label="Username" aria-describedby="basic-addon1" ref={website}/>
            </div>
            <div class="form-floating">
                <textarea class="form-control" placeholder="Leave a Description here" id="floatingTextarea2" style={{ height: "100px" }} ref={description}></textarea>
                <label for="floatingTextarea2">Description</label>
            </div>
            <button className="btn btn-primary" onClick={submitSeller}>Continue</button>
        </div>
    )
}

export default SellerForm