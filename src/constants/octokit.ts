import { Octokit } from '@octokit/core';
import { RequestParameters } from '@octokit/core/dist-types/types';

interface OctokitRequestBase {
  owner: string;
  repo: string;
  baseUrl: RequestParameters['baseUrl'];
  headers: RequestParameters['headers'];
}

export const octokitRequestBase: OctokitRequestBase = {
  owner: 'danbileee',
  repo: 'blog-docs',
  baseUrl: 'https://api.github.com',
  headers: {
    authorization: process.env.GITHUB_ACCESS_TOKEN,
    'X-GitHub-Api-Version': '2022-11-28',
  },
};

export const octokitInstance = new Octokit({
  auth: process.env.GITHUB_ACCESS_TOKEN,
});
