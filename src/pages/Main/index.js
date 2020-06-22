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
      repositories: [],
    };

    componentWillMount() {
      if (
        localStorage.repositoriesStorage
            && localStorage.repositoriesStorage.length > 0
      ) {
        this.setState({
          repositories: JSON.parse(localStorage.repositoriesStorage),
        });
      }
    }

    handleAddRepository = async (event) => {
      event.preventDefault();

      this.setState({ loading: true });

      try {
        const { data: repository } = await api.get(
          `/repos/${this.state.repositoryInput}`,
        );

        repository.lastCommit = moment(repository.pushed_at).fromNow();

        this.setState({
          repositoryInput: '',
          repositories: [...this.state.repositories, repository],
          repositoryError: false,
        });

        localStorage.setItem(
          'repositoriesStorage',
          JSON.stringify(this.state.repositories),
        );
      } catch (err) {
        this.setState({ repositoryError: true });
      } finally {
        this.setState({ loading: false });
      }
    };

    removeRepository = (repositoryId) => {
      const storageRepositories = JSON.parse(
        localStorage.repositoriesStorage,
      );

      let newState = [];

      if (this.state.repositories.length > 1) {
        const findRepository = storageRepositories.findIndex(
          storageRepository => storageRepository.id === repositoryId,
        );

        newState = this.state.repositories.splice(findRepository, 1);
      }

      this.setState({ repositories: newState });

      localStorage.setItem(
        'repositoriesStorage',
        JSON.stringify(this.state.repositories),
      );
    };

    render() {
      return (
        <Container>
          <img src={logo} alt="Github Compare" />

          <Form
            onSubmit={this.handleAddRepository}
            withError={this.state.repositoryError}
          >
            <input
              placeholder="usuário/repositório"
              value={this.state.repositoryInput}
              onChange={event => this.setState({
                repositoryInput: event.target.value,
              })
                        }
            />
            <button type="submit">
              {this.state.loading ? (
                <i className="fa fa-spinner fa-pulse" />
              ) : (
                'OK'
              )}
            </button>
          </Form>

          <CompareList
            repositories={this.state.repositories}
            removeRepository={this.removeRepository}
          />
        </Container>
      );
    }
}
