import React, {Component} from 'react';
import axios from 'axios'
import Navbar from './navbar'
import PostList from './postList'
import SideBar from './sidebar'
import {Link} from 'react-router-dom'
import RightContent from './rightContent'

export default class Login extends Component {
    constructor(props) {
      super(props);
      this.state = {
          email: '',
          text_content: null,
          user_posts: null,
          userData: null,
          userAvatar: null,
          followings: []
      }
    }

    async componentDidMount() {
        const email = localStorage.getItem('email');
        const token = localStorage.getItem('token');
        await axios.post('/api/check_logged_in', {email: email}, {headers: 
        {'Content-Type': 'application/x-www-form-urlencoded',
         'Authorization': "Bearer " + token}})
         .then(res => {
            if (res.status !== 200) {
                localStorage.clear();
                this.props.history.push('/login');
            }
            else this.setState({userData: res, userAvatar: res.data.user.avatar[0].image, followings: res.data.followings});
        }).catch(err => {
            localStorage.clear();
            this.props.history.push('/login');
        })

        await this.requestPosts();
    }

    requestPosts = async () => {
        const email = localStorage.getItem('email');
        const token = localStorage.getItem('token');

        await axios.post('/api/get_home_feed', {email: email}, {headers: 
        {'Content-Type': 'application/x-www-form-urlencoded',
         'Authorization': "Bearer " + token}})
         .then(res => {
             console.log(res);
            if (res.status === 200)
                this.setState({user_posts: res.data.user_posts});
        }).catch(err => {})
    }

    render() {
        return (
            <div className='background'>
                <Navbar userData={this.state.userData} history={this.props.history}/>
                <div className='feed-container'>
                    <div className='row'>
                    <div className='d-none d-md-block col-lg-3 feed-column'>
                        <SideBar userData={this.state.userData} activeClass="home-item" />
                    </div>
                    <div className='col-sm-12 col-lg-6 feed-column'>
                        <div>
                            <PostList userAvatar = {this.state.userAvatar} posts={this.state.user_posts} isHomePage={true} allowToPost={true} requestPosts={this.requestPosts} />
                        </div>
                    </div>
                    <div className='d-none d-md-block col-sm-12 col-lg-3 feed-column'>
                        <RightContent followings={this.state.followings} />
                    </div>
                    </div>
                </div>
            </div>
        );
    }
  }