import WorkshopsAPI from '../api/workshops'
import PostsAPI from '../api/posts'
import UsersAPI from '../api/users'
import TagsAPI from '../api/tags'
import RedirectsAPI from '../api/redirects'
import PaymethodsAPI from '../api/paymethods'
import OrdersAPI from '../api/orders'
import BookingsAPI from '../api/bookings'
import ExpertsAPI from '../api/experts'
import CompanysAPI from '../api/companys'
import ViewsAPI from '../api/views'
import RequestsAPI from '../api/requests'
import PayoutsAPI from '../api/payouts'
import MojoAPI from '../api/mojo'

module.exports = {
  Workshops: WorkshopsAPI,
  Posts: PostsAPI,
  Users: UsersAPI,
  Tags: TagsAPI,
  Redirects: RedirectsAPI,
  Paymethods: PaymethodsAPI,
  Orders: OrdersAPI,
  Bookings: BookingsAPI,
  Experts: ExpertsAPI,
  Mojo: MojoAPI,
  Companys: CompanysAPI,
  Views: ViewsAPI,
  Requests: RequestsAPI,
  Payouts: PayoutsAPI
}
