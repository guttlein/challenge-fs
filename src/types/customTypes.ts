export type userType = {
  id: number,
  name: string,
  username: string,
  email: string,
  phone: string,
  address: {
    city: string,
    street: string,
    suite: string,
    zipcode: string,
  },
  company: {
    name: string,
    catchPhrase: string,
    bs: string
  },
  website: string
}

export type postType = {
  userId: number;
  id: number;
  title: string;
  body: string;
};