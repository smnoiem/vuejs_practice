Vue.component('product', {
    props: {
        premium: {
            type: Boolean,
            required: true,
            default: false
        }
    },
    template: `
        <div class="product">

            <div class="product-image">
                <img :src="image" alt="">
            </div>

            <div class="product-info">

                <h1>{{ title }}</h1>

                <p v-if="inStock >= 10">In Stock</p>
                <p v-else-if="inStock > 0">Only few items left</p>

                <p :class="{strikethrough: inStock}">Out of Stock</p>

                <p>{{ sale }}</p>

                <p>Shipping : {{ shipping }}</p>

                <product-details :details="details"></product-details>

                <div v-for="(variant, index) in variants" 
                    :key="variant.id"
                    class="color-box"
                    :style="{ backgroundColor: variant.color }"
                    @mouseover="updateProduct(index)">

                </div>

                <button 
                    v-on:click="addToCart" 
                    v-bind:disabled="!inStock"
                    :class="{disabledButton: !inStock}"> Add to Cart</button>

                <button v-on:click="removeFromCart" :disabled="!inStock">Remove From Cart</button>

                <div>
                    <h4>Available Sizes:</h4>
                    <ul>
                        <li v-for="size in sizes">{{ size }}</li>
                    </ul>
                </div>

            </div>

            <div>
                <h2>Reviews</h2>
                <p v-show="!reviews.length">There are no reviews yet.</p>
                <ul>
                    <li v-for="review in reviews">
                        <p>{{review.name}}</p>
                        <p>{{review.rating}}</p>
                        <p>{{review.review}}</p>
                        <p>{{ (review.recommended == true) ? 'Recommended' : 'Not Recommended' }}</p>
                    </li>
                </ul>
            </div>

            <product-review @review-submitted="addReview"></product-review>

        </div>
    `,
    data() {
        return {
            product: 'Socks',
            brand: 'Nike',
            selectedVariant: 0,
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusamus, expedita architecto tempora ipsam repellendus illo modi officia esse voluptatibus numquam culpa omnis dolorum ut doloremque cumque impedit libero a quam.",
            link: 'https://www.mediusware.com/',
            showLink: true,
            details: ['80% cotton', '20% polyester', 'unisex'],
            variants: [
                {
                    id: 1,
                    color: 'blue',
                    image: './assets/vmSocks-blue-onWhite.png',
                    quantity: 9,
                },
                {
                    id: 2,
                    color: 'green',
                    image: './assets/vmSocks-green-onWhite.jpg',
                    quantity: 0,
                }
            ],
            sizes: ['S', 'L', 'XL', 'XXL'],
            onSale: true,
            reviews: []
        }
    },
    methods: {
        addToCart: function () {
            this.$emit('update-cart', this.variants[this.selectedVariant].id, 'add')
        },
        removeFromCart: function () {
            this.$emit('update-cart', this.variants[this.selectedVariant].id, 'remove')
        },
        updateProduct: function (index) {
            this.selectedVariant = index
        },
        addReview(productReview) {
            this.reviews.push(productReview)
        }
    },
    computed: {
        title: function () {
            return this.brand + ' ' + this.product
        },
        image() {
            return this.variants[this.selectedVariant].image
        },
        inStock() {
            return this.variants[this.selectedVariant].quantity
        },
        sale() {
            return this.brand + " " + this.product + " are " + (this.onSale ? 'on sale' : 'not on sale')
        },
        shipping() {
            if(this.premium) return 'Free'
            return 'Paid'
        }
    }
})

Vue.component('product-details', {
    props: {
        details: {
            type: Array,
            required: true,
            default: 'Value for bucks'
        }
    },
    template: `
        <div>
            <h4>Details:</h4>
            <ul>
                <li v-for="detail in details">{{ detail }}</li>
            </ul>
        </div>
    `,
})

Vue.component('product-review', {
    props: {
        //
    },
    template: `
        <form class="review-form" @submit.prevent="onSubmit">

            <p v-if="errors.length">
                Please correct the following errors.
                <ul>
                    <li v-for="error in errors">{{error}}</li>
                </ul>
            </p>

            <p>
            <label for="name">Name:</label>
            <input id="name" v-model="name" placeholder="name">
            </p>
            
            <p>
            <label for="review">Review:</label>      
            <textarea id="review" v-model="review"></textarea>
            </p>
            
            <p>
            <label for="rating">Rating:</label>
            <select id="rating" v-model.number="rating">
                <option>5</option>
                <option>4</option>
                <option>3</option>
                <option>2</option>
                <option>1</option>
            </select>
            </p>

            <p> Would you recommend this product? </p>
            <input type="radio" name="recommended" v-model="recommended" value="1">Yes
            <input type="radio" name="recommended" v-model="recommended" value="0">No
                
            <p>
            <input type="submit" value="Submit">  
            </p>
        </form>
    `,
    data() {
        return {
            name: null,
            review: null,
            rating: null,
            recommended: null,
            errors: []
        }
    },
    methods: {
        onSubmit() {

            this.errors = []

            if(this.name && this.review && this.rating && this.recommended) 
            {
                let productReview = {
                    name: this.name,
                    review: this.review,
                    rating: this.rating,
                    recommended: this.recommended
                }
    
                this.$emit('review-submitted', productReview)
    
                this.name = null
                this.review = null
                this.rating = null
                this.recommended = null
            }
            else {
                if(!this.name) this.errors.push('name required')
                if(!this.review) this.errors.push('review required')
                if(!this.rating) this.errors.push('rating required')
                if(!this.recommended) this.errors.push('recommendation selection required')
            }
        }
    }
})

let app = new Vue({
    el: '#app',
    data: {
        premium: true,
        cart: [],
    },
    methods: {
        updateCart(id, action) {

            if(action == 'add') this.cart.push(id)

            if(action == 'remove') {
                let index = this.cart.indexOf(id);
                if(index !== -1) {
                    this.cart.splice(index, 1)
                }
            }
        }
    }
})