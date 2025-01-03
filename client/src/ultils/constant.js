import path from './path'
import icons from './icon'
import { FaUserGear } from "react-icons/fa6";
import { BsFillTagsFill } from "react-icons/bs";
import { SlCalender } from "react-icons/sl";
import { FaMoneyBillTrendUp } from "react-icons/fa6";
import { TbBrandBooking } from "react-icons/tb";
import { MdPostAdd } from "react-icons/md";
import { CiDiscount1 } from "react-icons/ci";
export const navigation = [
    {
        id: 1,
        value: 'HOME',
        path: `/${path.HOME}`
    },
    {
        id: 2,
        value: 'SERVICES',
        path: `/${path.SERVICES}`
    },
    {
        id: 3,
        value: 'PRODUCTS',
        path: `/${path.PRODUCTS}`
    },
    {
        id: 4,
        value: 'BLOGS',
        path: `/${path.BLOGS}`
    },
    {
        id: 5,
        value: 'OUR PROVIDERS',
        path: `/${path.OUR_PROVIDERS}`
    },
    {
        id: 6,
        value: 'FAQS',
        path: `/${path.FAQS}`
    },
    
]

const {FaShieldHalved,FaTruck,FaGift,FaReply,FaTty} = icons
export const productExtra = [
    {
        id:'1',
        title:'Guarantee',
        sup:'Quality Checked',
        icon: <FaShieldHalved />
    },
    {
        id:'2',
        title:'Free Shipping',
        sup:'Free On All Products',
        icon: <FaTruck />
    },
    {
        id:'3',
        title:'Special Gift Cards',
        sup:'Special Gift Cards',
        icon: <FaGift />
    },
    {
        id:'4',
        title:'Free Return',
        sup:'Within 7 Days',
        icon: <FaReply />
    },
    {
        id:'5',
        title:'Consultancy',
        sup:'Lifetime 24/7/365',
        icon: <FaTty />
    },
]

export const tabs = [
    {
        id: 1,
        name: 'DESCRIPTION',
        content: `Technology: GSM / HSPA / LTE
        Dimensions: 146 x 72 x 8.1 mm
        Weight: 161 g
        Display: IPS LCD 5.2 inches
        Resolution: 1080 x 1920
        OS: Android OS, v6.0.1 (Marshmallow)
        Chipset: Snapdragon 820
        CPU: Quad-core
        Internal: 32/64 GB
        Camera: 23 MP, f/2.0 - 13 MP, f/2.0
        Sony's latest flagship, the Xperia Z6 comes with refined design, improved camera, and a due update in specs. Wait, back up a little there - it's actually called the Xperia XZ this time around but, yeah, the rest of that is true.
        
        When Sony announced the new X-series, some suggested that the Xperia X Performance was meant to take on the likes of the Galaxy S7's and HTC 10's, but we knew that couldn't be the case. Okay, 'suspected' might be more accurate there. Obviously, now we all know that the Xperia XZ is Sony's top-dog for this season, and the Z in its name quickly reveals its ancestry.
        
        Indeed, the XZ has a lot in common with the Z5. The display, for one, is the same size and resolution as the last generation - not necessarily a bad thing, but the XZ also comes with 3GB of RAM - modern-day flagships will crack a condescending smile seeing that in the spec sheet.
        
        No one will laugh at the rest of it, though - top-of-the-line Snapdragon 820 chipset, 23MP camera with a trio of focusing technologies and 4K video recording (one could think the Z is required for that, had it not been for the M5), high-res 13MP front camera, Type-C connectivity, fingerprint reader, IP68 rating, stereo speakers - name one thing missing.`
    },
    {
        id: 2,
        name: 'WARRANTY',
        content: `WARRANTY INFORMATION
        LIMITED WARRANTIES
        Limited Warranties are non-transferable. The following Limited Warranties are given to the original retail purchaser of the following Ashley Furniture Industries, Inc.Products:
        
        Frames Used In Upholstered and Leather Products
        Limited Lifetime Warranty
        A Limited Lifetime Warranty applies to all frames used in sofas, couches, love seats, upholstered chairs, ottomans, sectionals, and sleepers. Ashley Furniture Industries,Inc. warrants these components to you, the original retail purchaser, to be free from material manufacturing defects.`

    },
    {
        id: 3,
        name: 'DELIVERY',
        content: `PURCHASING & DELIVERY
        Before you make your purchase, it’s helpful to know the measurements of the area you plan to place the furniture. You should also measure any doorways and hallways through which the furniture will pass to get to its final destination.
        Picking up at the store
        Shopify Shop requires that all products are properly inspected BEFORE you take it home to insure there are no surprises. Our team is happy to open all packages and will assist in the inspection process. We will then reseal packages for safe transport. We encourage all customers to bring furniture pads or blankets to protect the items during transport as well as rope or tie downs. Shopify Shop will not be responsible for damage that occurs after leaving the store or during transit. It is the purchaser’s responsibility to make sure the correct items are picked up and in good condition.
        Delivery
        Customers are able to pick the next available delivery day that best fits their schedule. However, to route stops as efficiently as possible, Shopify Shop will provide the time frame. Customers will not be able to choose a time. You will be notified in advance of your scheduled time frame. Please make sure that a responsible adult (18 years or older) will be home at that time.
        In preparation for your delivery, please remove existing furniture, pictures, mirrors, accessories, etc. to prevent damages. Also insure that the area where you would like your furniture placed is clear of any old furniture and any other items that may obstruct the passageway of the delivery team. Shopify Shop will deliver, assemble, and set-up your new furniture purchase and remove all packing materials from your home. Our delivery crews are not permitted to move your existing furniture or other household items. Delivery personnel will attempt to deliver the purchased items in a safe and controlled manner but will not attempt to place furniture if they feel it will result in damage to the product or your home. Delivery personnel are unable to remove doors, hoist furniture or carry furniture up more than 3 flights of stairs. An elevator must be available for deliveries to the 4th floor and above.`
    },
    {
        id: 4,
        name: 'PAYMENT',
        content:`PURCHASING & DELIVERY
        Before you make your purchase, it’s helpful to know the measurements of the area you plan to place the furniture. You should also measure any doorways and hallways through which the furniture will pass to get to its final destination.
        Picking up at the store
        Shopify Shop requires that all products are properly inspected BEFORE you take it home to insure there are no surprises. Our team is happy to open all packages and will assist in the inspection process. We will then reseal packages for safe transport. We encourage all customers to bring furniture pads or blankets to protect the items during transport as well as rope or tie downs. Shopify Shop will not be responsible for damage that occurs after leaving the store or during transit. It is the purchaser’s responsibility to make sure the correct items are picked up and in good condition.
        Delivery
        Customers are able to pick the next available delivery day that best fits their schedule. However, to route stops as efficiently as possible, Shopify Shop will provide the time frame. Customers will not be able to choose a time. You will be notified in advance of your scheduled time frame. Please make sure that a responsible adult (18 years or older) will be home at that time.
        In preparation for your delivery, please remove existing furniture, pictures, mirrors, accessories, etc. to prevent damages. Also insure that the area where you would like your furniture placed is clear of any old furniture and any other items that may obstruct the passageway of the delivery team. Shopify Shop will deliver, assemble, and set-up your new furniture purchase and remove all packing materials from your home. Our delivery crews are not permitted to move your existing furniture or other household items. Delivery personnel will attempt to deliver the purchased items in a safe and controlled manner but will not attempt to place furniture if they feel it will result in damage to the product or your home. Delivery personnel are unable to remove doors, hoist furniture or carry furniture up more than 3 flights of stairs. An elevator must be available for deliveries to the 4th floor and above.`
    },
]

export const colors = [
    'black',
    'brown',
    'gray',
    'white',
    'pink',
    'yellow',
    'orange',
    'purple',
    'green',
    'blue'
]

export const sorts = [
    {
        id:1,
        value: '-sold',
        text: 'Best selling'
    },
    {
        id:2,
        value: 'title',
        text: 'Alphabetically, A-Z'
    },
    {
        id:3,
        value: '-title',
        text: 'Alphabetically, Z-A'
    },
    {
        id:4,
        value: 'price',
        text: 'Price, low to high'
    },
    {
        id:5,
        value: '-price',
        text: 'Price, high to low'
    },
    {
        id:6,
        value: 'createdAt',
        text: 'Date, old to new'
    },
    {
        id:7,
        value: '-createdAt',
        text: 'Date, new to old'
    },
]

export const voteOptions = [
    {
        id:1,
        text: 'Terrible'
    },
    {
        id:2,
        text: 'Bad'
    },
    {
        id:3,
        text: 'Normal'
    },
    {
        id:4,
        text: 'Good'
    },
    {
        id:5,
        text: 'Perfect'
    },
]

const {RiDashboard3Line, MdGroups, MdOutlineProductionQuantityLimits, RiBillLine} = icons
export const adminSidebar = [
    {
        id: 1,
        type: 'single',
        text: 'Dashboard',
        path: `/${path.ADMIN}/${path.DASHBOARD}`,
        icon: <RiDashboard3Line size={20}/>
    },
    {
        id: 2,
        type: 'single',
        text: 'Working Calendar',
        path: `/${path.ADMIN}/${path.STAFF_CALENDAR}`,
        icon: <SlCalender size={20}/>
    },
    {
        id: 3,
        type: 'single',
        text: 'Manage Customer',
        path: `/${path.ADMIN}/${path.MANAGE_USER}`,
        icon: <MdGroups size={20}/>
    },
    {
        id: 4,
        type: 'parent',
        text: 'Manage Product',
        submenu:[
            {
                text: 'Create Product',
                path: `/${path.ADMIN}/${path.CREATE_PRODUCT}`
            },
            {
                text: 'Manage Product',
                path: `/${path.ADMIN}/${path.MANAGE_PRODUCT}`
            }
        ],
        icon: <MdOutlineProductionQuantityLimits size={20}/>
    },
    {
        id: 5,
        type: 'single',
        text: 'Manage Order',
        path: `/${path.ADMIN}/${path.MANAGE_ORDER}`,
        icon: <RiBillLine size={20}/>
    },
    {
        id: 6,
        type: 'single',
        text: 'Manage Booking',
        path: `/${path.ADMIN}/${path.MANAGE_BOOKING}`,
        icon: <TbBrandBooking size={20}/>
    },
    {
        id: 7,
        type: 'parent',
        text: 'Manage Staff',
        submenu:[
            {
                text: 'Add Staff',
                path: `/${path.ADMIN}/${path.ADD_STAFF}`
            },
            {
                text: 'Manage Staff',
                path: `/${path.ADMIN}/${path.MANAGE_STAFF}`
            }
        ],
        icon: <FaUserGear size={20}/>
    },
    {
        id: 8,
        type: 'parent',
        text: 'Manage Service',
        submenu:[
            {
                text: 'Add Service',
                path: `/${path.ADMIN}/${path.ADD_SERVICE}`
            },
            {
                text: 'Manage Service',
                path: `/${path.ADMIN}/${path.MANAGE_SERVICE}`
            }
        ],
        icon: <BsFillTagsFill size={20}/>
    },
    {
        id: 9,
        type: 'parent',
        text: 'Manage Post',
        submenu:[
            {
                text: 'Add Post',
                path: `/${path.ADMIN}/${path.ADD_POST}`
            },
            {
                text: 'Manage Post',
                path: `/${path.ADMIN}/${path.MANAGE_POST}`
            }
        ],
        icon: <MdPostAdd size={20}/>
    },
    {
        id: 10,
        type: 'parent',
        text: 'Manage Customer Program',
        submenu:[
            {
                text: 'Add Customer Program',
                path: `/${path.ADMIN}/${path.ADD_SERVICE}`
            },
            {
                text: 'Manage Customer Program',
                path: `/${path.ADMIN}/${path.MANAGE_SERVICE}`
            }
        ],
        icon: <CiDiscount1 size={20}/>
    },
]

export const roles = [
    {
        code: 1411,
        value: 'Admin'
    },
    {
        code: 202,
        value: 'User'
    }
]

export const blockStatus = [
    {
        code: true,
        value: 'Blocked'
    },
    {
        code: false,
        value: 'Active'
    }
]


export const userSidebar = [
    {
        id: 1,
        type: 'single',
        text: 'Personal',
        path: `/${path.USER}/${path.PERSONAL}`,
        icon: <RiDashboard3Line size={20}/>,
        visibleForRole: [202, 1411],
    },
    {
        id: 2,
        type: 'single',
        text: 'My cart',
        path: `/${path.USER}/${path.MYCART}`,
        icon: <MdGroups size={20}/>,
        visibleForRole: [202],
    },
    {
        id: 3,
        type: 'single',
        text: 'History',
        path: `/${path.USER}/${path.HISTORY}`,
        icon: <MdGroups size={20}/>,
        visibleForRole: [202],
    },
    {
        id: 4,
        type: 'single',
        text: 'Wish List',
        path: `/${path.USER}/${path.WISHLIST}`,
        icon: <RiBillLine size={20}/>,
        visibleForRole: [202],
    },
    {
        id: 5,
        type: 'single',
        text: 'My Bussiness',
        path: `/${path.USER}/${path.MY_SERVICE_PROVIDER}`,
        icon: <RiBillLine size={20}/>,
        visibleForRole: [1411],
    },
]


export const statusOrder = [
    {
        label: 'Canceled',
        value: 'Canceled',
    },
    {
        label: 'Successful',
        value: 'Successful',
    }
]

export const hour = [
    {
        code: 0,
        value: '0 hour'
    },
    {
        code: 1,
        value: '1 hour'
    },
    {
        code: 2,
        value: '2 hours'
    },
    {
        code: 3,
        value: '3 hours'
    },
    {
        code: 4,
        value: '4 hours'
    },
    {
        code: 5,
        value: '5 hours'
    },
    {
        code: 6,
        value: '6 hours'
    },
    {
        code: 7,
        value: '7 hours'
    },
    {
        code: 8,
        value: '8 hours'
    },
    {
        code: 9,
        value: '9 hours'
    },
    {
        code: 10,
        value: '10 hours'
    },
    {
        code: 11,
        value: '11 hours'
    },
    {
        code: 12,
        value: '12 hours'
    },

]

export const minute = [
    {
        code: 0,
        value: '0 minute'
    },
    {
        code: 5,
        value: '5 minutes'
    },
    {
        code: 10,
        value: '10 minutes'
    },
    {
        code: 15,
        value: '15 minutes'
    },
    {
        code: 20,
        value: '20 minutes'
    },
    {
        code: 25,
        value: '25 minutes'
    },
    {
        code: 30,
        value: '30 minutes'
    },
    {
        code: 35,
        value: '35 minutes'
    },
    {
        code: 40,
        value: '40 minutes'
    },
    {
        code: 45,
        value: '45 minutes'
    },
    {
        code: 50,
        value: '50 minutes'
    },
    {
        code: 55,
        value: '55 minutes'
    },
]
