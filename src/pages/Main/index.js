import React, { Component } from 'react';
import moment from 'moment';

import api from '../../services/api';

import logo from '../../assets/images/logo.png';
import { Container, Form } from './styles';

import CompareList from '../../components/CompareList';

export default class Main extends Component {
  state = {
    loading: false,
    repositoryError: false,
    repositoryInput: '',
    respositories: [],
  };

  componentWillMount() {
    if (localStorage.repositoriesStorage.length > 0) {
      this.setState({ respositories: JSON.parse(localStorage.repositoriesStorage) });
    }
  }

  handleAddRepository = async (event) => {
    event.preventDefault();

    this.setState({ loading: true });

    try {
      const { data: repository } = await api.get(`/repos/${this.state.repositoryInput}`);

      repository.lastCommit = moment(repository.pushed_at).fromNow();

      this.setState({
        repositoryInput: '',
        respositories: [...this.state.respositories, repository],
        repositoryError: false,
      });

      localStorage.setItem('repositoriesStorage', JSON.stringify(this.state.respositories));
    } catch (err) {
      this.setState({ repositoryError: true });
    } finally {
      this.setState({ loading: false });
    }
  };

  render() {
    return (
      <Container>
        <img src={logo} alt="Github Compare" />

        <Form onSubmit={this.handleAddRepository} withError={this.state.repositoryError}>
          <input
            placeholder="usuário/repositório"
            value={this.state.repositoryInput}
            onChange={event => this.setState({ repositoryInput: event.target.value })}
          />
          <button type="submit">
            {this.state.loading ? <i className="fa fa-spinner fa-pulse" /> : 'OK'}
          </button>
        </Form>

        <CompareList respositories={this.state.respositories} />
      </Container>
    );
  }
}
