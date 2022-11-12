import axios from 'axios'
const baseUrl = 'http://localhost:3001/reviews'

const courses = [
  {
    code: "CS-C3240",
    reviews: [
      {
        text: "skip this course if u can",
        likes: 1,
        dislikes: 0,
        difficulty: 5,
        workload: 4,
        teaching: 1,
        id: 1,
      },
      {
        text: "this machine learning course was asss",
        likes: 5,
        dislikes: 1,
        difficulty: 5,
        workload: 5,
        teaching: 1,
        id: 2,
      },
    ],
  },
  {
    code: "CS-C3120",
    reviews: [
      {
        text: "free credits, recommend!",
        likes: 2,
        dislikes: 17,
        difficulty: 1,
        workload: 2,
        teaching: 4,
        id: 3,
      },
    ],
  },
  {
    code: "CS-E4000",
    reviews: [
      {
        text: "decent course",
        likes: 3,
        dislikes: 3,
        difficulty: 3,
        workload: 3,
        teaching: 3,
        id: 4,
      },
    ],
  },
];

const getReview = async (code) => {
  const response = await axios.get(`${baseUrl}/${code}`)
  return response.data
};

const create = async newReview => {
  const response = await axios.post(baseUrl, newReview)
  return response.data
}

const reviewServices = { getReview, create };

export default reviewServices;
