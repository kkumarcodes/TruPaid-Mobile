import {gql} from '@apollo/client';

export const ADD_CATEGORY_PREFERENCES = gql`
    mutation AddCategoryPreferences($categories: [ID]!) {
      addCategoryPreferences(categories: $categories) {
        user {
          profile {
            categoryPreferences {
              category {
                name
              }
            }
          }
        }
      }
    }
  `;

export const GET_CATEGORIES = gql`
    {
      categories {
        id
        parentId
        name
        slug
        image {
          id
          cloudinaryData {
            url
            secure_url
          }
        }
        numChildren
      }
    }
  `;

// mutation addCategories(
//               $categories: [ID]!
//             ) {
//               addCategoryPreferences(
//                 categories: $categories,
//               ) {
//                 userId
//                 categoryId
//               }
//             }
//         `,


export const FEED_DEALS = `
    {
      feedDeals {
        id
        rewardType
        rewardValue
        rewardMax
        activations
        redemptions
        brand {
          id
          name
          thumbnailUrl
        }
      }
    }
  `;

export const MY_RECEIPTS_QUERY = gql`
    {
      myReceipts {
        id
        subtype
        visibility
        amount
        description
        status
        timestamp
        brand {
          id
          name
          thumbnailUrl
          deals {
            rewardType
            rewardValue
          }
        }
        user {
          id
          firstName
          lastName
          email
          profile {
            followers {
              followerId
            }
            following {
              followerId
            }
          }
          posts {
            id
            pendingDemand
            influencedPurchases
          }
        }
        posts {
          id
          title
          description
          pendingDemand
          influencedPurchases
          createdAt
          updatedAt
          image {
            id
            cloudinaryData {
              asset_id
              secure_url
            }
          }
        }
      }  
    }
  `;

export const CREATE_POST_QUERY = gql`
    mutation CreatePost($payload: PostCreatePayload) {
      createPost(payload: $payload) {
        id
        title
        description
        pendingDemand
        influencedPurchases
        createdAt
        updatedAt
        user{
          id
        }
        receipt {
          id      
        }
        image {
          cloudinaryData {
            url
            secure_url
          }
        }
      }
    }
`;

export const CREATE_POST_IMAGE_QUERY = gql`
    mutation CreatePostImage($payload: ImagePayload!) {
      createPostImage(payload: $payload) {
        id
      }
    }
`;


export const GET_POST_QUERY = gql`
    query Post($id: ID!) {
      post(
        id: $id,
      ) {
          id
          title
          description
          pendingDemand
          influencedPurchases
          createdAt
          updatedAt
          user {
            id
            firstName
            lastName
            profile {
              id
              image {
                id
                cloudinaryData {
                  url
                  secure_url
                }
              }
            }
          }
          receipt {
            id
            brand {
              id
              name
              thumbnailUrl
              deals {
                id
                rewardType
                rewardValue
              }
            }
          }
          image {
            id
            cloudinaryData {
              secure_url
              width
              height
              tags
            }
          }
      }
    }
`;

export const INFLUENCED_BY_QUERY = gql`
    mutation InfluencedBy($postId: ID!) {
      influencedBy(postId: $postId) {
        id
        userId
        postId
        status
        post {
          id
          pendingDemand
        }
      }
    }
`;

export const GET_TRENDING_FEED_QUERY = gql `
    query TrendingFeed ($pageSize: Int, $next: String) {
      trendingFeed (
        pageSize: $pageSize,
        next: $next
      ) {
          cursor
          nodes {
            id
            title
            description
            brandName
            pendingDemand
            influencedPurchases
            createdAt
            updatedAt
            user {
              id
              firstName
              lastName
              profile {
                id
                image {
                  id
                  cloudinaryData {
                    url
                    secure_url
                  }
                }
              }
            }
            image {
                cloudinaryData {
                url
                secure_url
              }
            }
          }
        }
    }
`

export const GET_PEOPLE_TO_FOLLOW = gql `
    query PeopleToFollow ($pageSize: Int, $next: String) {
      peopleToFollow (
        pageSize: $pageSize,
        cursor: $next
      ) {
          cursor
          nodes {
            id
            firstName
            lastName
            profile {
              id
              image {
                id
                cloudinaryData {
                  url
                  secure_url
                }
              }
            }
          }
        }
    }
`

export const GET_BRANDS_TO_FOLLOW = gql `
    query BrandsToFollow ($pageSize: Int, $next: String) {
      brandsToFollow (
        pageSize: $pageSize,
        cursor: $next
      ) {
          cursor
          nodes {
            id
            name
            thumbnailUrl
            webUrl
          }
        }
    }
`

export const FOLLOW_BRANDS_QUERY = gql`
    mutation FollowBrands($brandIds: [ID]!) {
      followBrands(
        brands: $brandIds
      ) {
          userId
          brandId
        }
    }
`;


export const GET_FOLLOWING_FEED_QUERY = gql `
    query FollowingFeed ($pageSize: Int, $next: String) {
      followingFeed (
        pageSize: $pageSize,
        next: $next
      ) {
          cursor
          nodes {
            id
            title
            description
            brandName
            pendingDemand
            influencedPurchases
            createdAt
            updatedAt
            user {
              id
              firstName
              lastName
              profile {
                id
                image {
                  id
                  cloudinaryData {
                    url
                    secure_url
                  }
                }
              }
            }
            image {
                cloudinaryData {
                url
                secure_url
              }
            }
          }
        }
    }
`

export const GET_POSTS_BY_USERID_QUERY = gql`
    query Posts($pageSize: Int, $before: String, $after: String, $userId: ID) {
        posts(
          pageSize: $pageSize,
          before: $before,
          after: $after,
          userId: $userId
        ) {
            nextCursor
            prevCursor
            nodes {
              id
              title
              description
              pendingDemand
              influencedPurchases
              createdAt
              updatedAt
              user {
                id
                firstName
                lastName
                profile {
                  id
                  image {
                    id
                    cloudinaryData {
                      url
                      secure_url
                    }
                  }
                }
              }
              receipt {
                id
                brand {
                  id
                  name
                  thumbnailUrl
                  deals {
                    rewardType
                    rewardValue
                  }
                }
              }
              image {
                id
                cloudinaryData {
                  url
                  secure_url
                }
              }
          }
        }
    }
`;

export const GET_PERSON_QUERY = gql`
                  query Person($id: ID!) {
                    person(
                      id: $id,
                    ) {    
                      id
                      firstName
                      lastName
                      email
                      profile {
                        id
                        userId
                        image {
                          id
                          cloudinaryData {
                            secure_url
                            width
                            height
                            tags
                          }
                        }
                        stats {
                          id
                          userId
                          numReceipts
                          numPosts
                          numFollowers
                          numFollowing
                          totalPendingDemand
                          totalInfluencedPurchases
                          reveelScore
                        }
                        followedBrands {
                          brandId
                          brand {
                            id
                            name
                            deals {
                              id
                              finePrint
                              rewardType
                              rewardValue
                              rewardMax
                              feeType
                              feeValue
                              feeMax
                              requiresActivation
                              activations
                              redemptions
                            }
                          }
                        }
                        followers {
                          userId
                          followerId
                        }
                        following {
                          userId
                          followerId
                          followed {
                            userId
                            user {
                              id
                              firstName
                              lastName
                              email
                            }
                            liveFollowers
                            liveFollowing
                          }
                          follower {
                            userId
                            user {
                              id
                              firstName
                              lastName
                              email
                            }
                            liveFollowers
                            liveFollowing
                          }
                        }
                      }
                      posts {
                        id
                        title
                        description
                        pendingDemand
                        influencedPurchases
                        createdAt
                        updatedAt
                        user {
                          id
                          firstName
                          lastName
                          email
                        }
                        receipt {
                          id
                          brand {
                            id
                            name
                            deals {
                              id
                              rewardType
                              rewardValue
                            }
                          }
                        }
                        image {
                          id
                          cloudinaryData {
                            secure_url
                            width
                            height
                            tags
                          }
                        }
                      }
                    }
                  }
                  `;

export const FOLLOWER_USERS_QUERY = gql`
    mutation FollowUsers($userIds: [ID]!) {
      followUsers(
        users: $userIds
      ) {
          userId
          followerId
          followed {
            liveFollowers
          }
          follower {
            liveFollowing
          }
        }
    }
`;

export const UNFOLLOWER_USERS_QUERY = gql`
  mutation UnfollowUser($userId: ID!) {
    unfollowUser(userId: $userId) {
      userId
      followerId
      followed {
        liveFollowers
      }
      follower {
        liveFollowing
      }
    }
  }
`;

export const UPDATE_USER_PROFILE_QUERY = gql`
    mutation UpdateUserProfile($payload: UserProfilePayload) {
      updateUserProfile(payload: $payload)
    }
`;
export const CREATE_PROFILE_IMAGE_QUERY = gql`
    mutation CreateProfileImage($payload: ImagePayload!) {
      createProfileImage(payload: $payload) {
        id
      }
    }
`;

export const GET_PLAID_LINK_TOKEN = gql`
    query GetPlaidLinkToken($packageName: String) {
      getPlaidLinkToken(
        androidPackageName: $packageName
      ) {
        linkToken
        expiration
        requestId
      }
    }
`;

export const GET_ACCESS_TOKEN = gql`
    query ExchangePlaidPublicToken($publicToken: String!) {
      exchangePlaidPublicToken(
        publicToken: $publicToken
      ) {
        accessToken
        itemId
      }
    }
`;

export const CREATE_PLAID_ITEMS = gql`
    mutation CreatePlaidItems($items: [PlaidItemPayload]!) {
      createPlaidItems(items: $items) {
                id
                itemId
                userId
                institution {
                  institutionId
                  name
                  url
                  primaryColor
                  logoUri
                }
                accounts {
                  accountId
                  name
                  type
                  subtype
                  mask
                }
      }
    }
`;


export const POST_APTO_USER = gql`
  mutation postAptoUser($payload: AptoUserPayload!) {
    postAptoUser(payload: $payload) {
      id
      reveelAptoId
      aptoId
      firstName
      lastName
      email
      birthday
      kycStatus
      addresses {
        id
        userId
        streetOne
        streetTwo
        locality
        region
        postalCode
        country
      }
      agreements {
        id
        agreementId
        agreementKey
        userAction
        recordedAt
      }
      applications {
        id
        applicationId
        status
        createTime
        workflowObjectId
        applicationData
        nextAction
        metadata
      }
      cards {
        id
        accountId
        lastFour
        cardNetwork
        cardBrand
        cardIssuer
        nameOnCard
        expiration
        panToken
        cvvToken
        status
        kycStatus
        kycReason
        balances
        orderedStatus
        cardholderFirstName
        cardholderLastName
        issuedAt
        waitList
        cardProductId
        metadata
        cardStyle
        features
      }
      disclaimers {
        id
        workflowObjectId
        actionId
        context
      }
      phones {
        id
        countryCode
        phoneNumber
        verified
        notSpecified
        primaryVerification {
          id
          type
          status
          verificationId
          verificationType
          mechanism
        }
        secondaryVerification {
          id
          type
          status
          verificationId
          verificationType
          mechanism
        }
      }
      token {
        id
        userToken
        expiredAt
      }
    }
  }
`;

export const POST_APTO_AGREEMENT = gql`
  mutation postAptoAgreement($payload: AptoAgreementPayload!) {
    postAptoAgreement(payload: $payload) {
      id
      agreementId
      agreementKey
      userAction
      recordedAt
    }
  }
`;

export const APTO_MOBILE_ACCESS = gql`
  query {
    aptoMobileAccess {
      mobileAPIPublicKey
      aptoUser {
        id
        reveelAptoId
        firstName
        lastName
        email
        birthday
      }
    }
  }
`;

export const POST_APTO_CARD = gql`
  mutation postAptoCard($payload: AptoCardPayload!) {
    postAptoCard(payload: $payload) {
      id
      accountId
      lastFour
      cardNetwork
      cardBrand
      cardIssuer
      nameOnCard
      expiration
      panToken
      cvvToken
      status
      kycStatus
      kycReason
      balances
      orderedStatus
      cardholderFirstName
      cardholderLastName
      issuedAt
      waitList
      cardProductId
      metadata
      cardStyle
      features
    }
  }
`;