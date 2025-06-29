db.cars.aggregate([
    {$group: {
        _id: "$fuel_type",//group is based on field fuel_type thats why $ sign 
        TotalCars: {$sum: 1
            },
             AvgPrice:{$avg:"$price"}
             }
    }
])
<!-- [output
  { _id: "Hybrid", TotalCars: 1 },
  { _id: "Petrol", TotalCars: 2 },
  { _id: "Electric", TotalCars: 2 }
] -->


db.cars.aggregate([
    {$match: {
        maker: "Hyundai"
        }
    },
    {$project: {
        _id: 0,
        maker: 1,
        model: 1,
        fuel_type: 1
        }
    },
    {$sort: {model: 1
        }
    }
])

db.cars.aggregate([
    {$sortByCount: "$maker"
    }
])

db.cars.aggregate([
    {$match: {maker: "Hyundai"
        }
    },
    {$project: {
        _id: 0,
        Car_Name: {$toUpper: {$concat: [
                        "$maker",
                        " ",
                        "$model"
                    ]
                }
            }
        }
    },
    {$out: "hyundai_cars"
    }
])

db.cars.aggregate([
    {$project: {
        _id: 0,
        model: 1,
        is_diesel: {
            $regexMatch: {
                input: "$fuel_type",
                regex: "Dies"
                }
            }
        }
    }
])


db.cars.aggregate([
    {$project: {
        _id: 0,
        model: 1,
        price: 1
        }
    },
    {$addFields: {
        price_in_lakhs: {
            $round: [
                    {$divide: [
                            "$price",
                            90000
                        ]
                    },
                    1
                ]
            }
        }
    }
])

db.cars.aggregate([
    { $match: { maker: "Hyundai"
        }
    },
    { $set: {
        total_service_cost: {
            $sum: "$service_history.cost"
            }
        }
    },
    { $project: {
        _id: 0,
        model: 1,
        total_service_cost: 1
        }
    }
])

db.cars.aggregate([
    {$project: {
        _id: 0,
        maker: 1,
        model: 1,
        fuel_cat: {
            $cond: {
                if: {$eq: [
                            "$fuel_type",
                            "Petrol"
                        ]
                    },
                    then: "Petrol Car",
                else: "Non_petrol Car"
                }
            }
        }
    }
])

db.cars.aggregate([
    {$project: {
        _id: 0,
        maker: 1,
        model: 1,
        budget_cat: {
            $switch: {
                branches: [
                        { //If car is less than 5 Lakhs
                        case: {$lt: [
                                    "$price",
                                    500000
                                ]
                            },
                            then: "Budget"
                        },
                        {
                            //Car price range between 5-10 lakhs
                        case: {$and: [
                                    {$gte: [
                                            "$price",
                                            500000
                                        ]
                                    },
                                    {$lt: [
                                            "$price",
                                            1000000
                                        ]
                                    }
                                ]
                            },
                            then: "Mid-Range"
                        },
                        {
                        case: {$gte: [
                                    "$price",
                                    1000000
                                ]
                            },
                            then: "Premium"
                        }
                    ],
                default: "Unknown"
                }
            }
        }
    }
])

db.cars.aggregate(
              {$project: 
              {
                _id: 0,
                model: 1,
                date: "$$NOW"
    }
})

db.users.aggregate([
    {$lookup:{
        from:"orders",
        localField:"_id",
        foreignField:"user_id",
        as: "orders"
    }}
])


db.createCollection("users3", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["name", "phone"],
            properties:{
                name:{
                    bsonType: "string",
                    description: "Name should be string"
                }
            }
        }
    },
    validationLevel: "strict",
    validationAction: "error"
})

db.users.find().count()
db.users.find({name: 'Anthony Hurst'})
db.movies.find({title: 'The Ace of Hearts'}).explain("executionStats")
db.users.createIndex({ name: 1 })
db.users.dropIndex("name")
