


export const Admin_item = [
    {
        id: 1,
        item: "Dashboard",
        path:'/dashboard'
    },
    {
        id: 2,
        item: "Shipments",
        path:'/shipments'
    },
    {
        id: 3,
        item: "Accounts",
        path:null,
        list: [
            {
                id: 3.1,
                item: "Franchisee",
                path:'/franchiseAccounts',
            },
            {
                id: 3.2,
                item: "vendors",
                path:'/vendorAccounts',
            },
            {
                id: 3.3,
                item: "Riders",
                path:'/riderAccounts',
            },
            
            {
                id: 3.4,
                item: "cusomers",
                path:'/customerAccounts',
            },
        ]

    },
    {
        id: 4,
        item: "Revenue",
        path:'/revenue',
    },
    {
        id: 5,
        item: "Panda Tools",
        path:null,
        list:[
            {
                id: 5.1,
                item: "OTP View",
                path:'/otpView',
            },
            {
                id: 5.2,
                item: "Abandoned Cart",
                path:'/abandonedCart',
            },
            {
                id: 5.3,
                item: "Panda Config",
                path:'/pandaConfig',
            },
        ]
    },
    {
        id: 6,
        item: "Multivendor",
        path:'/multivendor',
    },
    {
        id: 7,
        item: "Pick Up & Drop",
        path:"/pickupAndDrop",
    },
    {
        id: 8,
        item: "Reports",
        path:"",
        list: [
            {
                id: 8.1,
                item: "Customer Transaction",
                path:'/customerTransactions',
            },
            {
                id: 8.2,
                item: "Customer Activity",
                path:'/customerActivityReport',

            },
            {
                id: 8.3,
                item: "Customer Orders",
                path:'/customerOrderReport',
            },
            {
                id: 8.4,
                item: "Reward Points",
                path:'customerRewardReport',
            },
            {
                id: 8.5,
                item: "Search Report",
                path:'/customerSearchReport',
            },
            {
                id: 8.6,
                item: "Tax Report",
                path:'/taxReport',
            },
            {
                id: 8.7,
                item: "Shipping Report",
                path:'/shippingReport',
            },
            {
                id: 8.8,
                item: "Return Report",
                path:'/returnReport',
            },
            {
                id: 8.9,
                item: "Sales Report",
                path:'/salesReport',
            },
            {
                id: 8.10,
                item: "Coupons Report",
                path:'/couponsReports',
            },
            {
                id: 8.11,
                item: "Products Viewed",
                path:'/dashboard',
            },
            {
                id: 8.12,
                item: "Product Purchased",
                path:'/productPurchasedReport',
            },
        ]
    },
    {
        id: 9,
        item: "User Management",
        path:'/userManagement',
        
    },
    {
        id: 10,
        item: "Settings",
        path:null,
        list:[
            {
              id:10.1,
              item:'Slider Management',
              path:'/sliderManagement',
            },
            {
                id:10.2,
                item:'Feedbacks',
                path:'/feedbacks',
              },
              {
                id:10.3,
                item:'Message Banner',
                path:'/messageBanner',
              },
              {
                id:10.4,
                item:'Rush Hour',
                path:'/rushHour',
              },
              {
                id:10.5,
                item:'Attendance',
                path:'/attendance',
              },
              {
                id:10.6,
                item:'Rate Card',
                path:'/rateCard',
              },
              {
                id:10.7,
                item:'Pickup & Drop Charges',
                path:'/pickupAndDropCharges',
              },
              {
                id:10.8,
                item:'Delivery Charges',
                path:'/deliveryCharges',
              },
              {
                id:10.9,
                item:'Extra Charges',
                path:'/extraCharges',
              },
              {
                id:10.9,
                item:'Order Assign Criteria',
                path:'/orderAssignCriteria',
              },
        ]
    },
    {
        id:11,
        item:'Smart Suggest',
        path:'/dashboard',
    },
    {
        id:12,
        item:'Promotion',
        path:null,
        list:[
            {
                id:12.1,
                item:'Coupons',
                path:'/coupons',
            },
            {
                id:12.2,
                item:'Panda Coins',
                path:'/pandaCoins',
            },
            
            {
                id:12.3,
                item:'Offers',
                path:'/offers',
            },
            

        ]
    }

]


//sales

export const sales_item = [
    {
        id: 1,
        item: "Franchisee",
        path:'/franchise',
    },
    {
        id: 2,
        item: "Vendor Profile",
        path:'/vendorProfile'
    },
    {
        id: 3,
        item: "Vendor Signup",
        path:"/vendor"
    },
    {
        id: 4,
        item: "Marketing",
        path:null,
        list:[
            {
                id:4.1,
                item:"Merchant Marketing",
                path:'/merchantMarketing',
            },
            {
                id:4.2,
                item:"Franchisee Marketing",
                path:'/franchiseMarketing',
            },
        ]
    },
    {
        id: 5,
        item: "Referred Restaurants",
        path:'/restaurantReferral',
    },
    {
        id: 6,
        item: "Franchisee Enquires",
        path:'/franchiseEnquires',
    },
    {
        id: 7,
        item: "Category Management",
        path:'/category',
    },
    {
        id: 8,
        item: "SubCategory",
        path:'/subCategory',
    },
    {
        id: 9,
        item: "Product Adding",
        path:'/products',
    },

]


//logs......


export const Logs_item = [

    {
        id: 1,
        item: "Smart Suggest List",
        path:'/smartSuggestList',
    },
    {
        id: 2,
        item: "Rider Onboarding",
        path:'/riderOnboarding',
    },
    {
        id: 3,
        item: "Onboarding List",
        path:'/onboardingList',
    },
    {
        id: 4,
        item: "Delivery Riders",
        path:'/deliveryRiders',
    },
    {
        id: 5,
        item: "Rider Lifecycle",
        path:'/riderLifecycle',
    },
    {
        id: 6,
        item: "Rider Support",
        path:'/riderSupport',
    },
    {
        id: 7,
        item: "Rider Summary",
        path:'/riderSummary',
    },
    {
        id: 8,
        item: "Rider Referrals",
        path:'/riderRefferal',
    },


]


export const support_item = [
    {
        id:1,
        item: 'Customer Complaints',
        path:'/dashboard',
    },
    {   
        id:2,
        item: 'Rider Tickets',
        path:'/dashboard',
    },
    {
        id:3,
        item: 'Customer Details',
        path:'/customerDetails',
    },
    {
        id:4,
        item: 'Customer Group',
        path:'/dashboard',
    },
    {
        id:5,
        item: 'Push Notification',
        path:'/dashboard',
    },
    {
        id:6,
        item: 'Latest Order Reviews',
        path:'/dashboard',
    },
    {
        id:7,
        item: 'Affiliate Onboarding',
        path:'/dashboard',
    },
    {
        id:8,
        item: 'Customer Referral',
        path:'/dashboard',
    },
    {
        id:9,
        item: 'Customer Chat History',
        path:'/dashboard',
    },
    {
        id:10,
        item: 'Order Summary',
        path:'/dashboard',
    },

]
