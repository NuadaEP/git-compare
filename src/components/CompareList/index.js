import React from 'react';
import PropTypes from 'prop-types';

import { Container, Repository } from './styles';

const removeRepository = (repositoryId) => {
  const storageRepositories = JSON.parse(localStorage.repositoriesStorage);

  const findRepository = storageRepositories.map((storageRepository, index) => {
    if (storageRepository.id === repositoryId) return index;
  });

  console.log(findRepository);
};

// const findRepository = (element, repositoryId) => {
//   if (element.id == repositoryId) {
//     return true;
//   }
//   return false;
// };

const CompareList = ({ respositories }) => (
  <Container>
    {respositories.map(repository => (
      <Repository key={repository.id}>
        <header>
          <img src={repository.owner.avatar_url} alt={repository.owner.login} />
          <strong>{repository.name}</strong>
          <small>{repository.owner.login}</small>
        </header>

        <button onClick={() => removeRepository(repository.id)}>DELETAR</button>

        <ul>
          <li>
            {repository.stargazers_count} <small>stars</small>
          </li>
          <li>
            {repository.forks_count} <small>forks</small>
          </li>
          <li>
            {repository.open_issues_count} <small>issues</small>
          </li>
          <li>
            {repository.lastCommit} <small>last commit</small>
          </li>
        </ul>
      </Repository>
    ))}
  </Container>
);

CompareList.propTypes = {
  respositories: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      owner: PropTypes.shape({
        login: PropTypes.string,
        avatar_url: PropTypes.string,
      }),
      stargazers_count: PropTypes.number,
      forks_count: PropTypes.number,
      open_issues_count: PropTypes.number,
      pushed_at: PropTypes.string,
    }),
  ).isRequired,
};

export default CompareList;
