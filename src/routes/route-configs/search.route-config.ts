import { SearchController } from '../../controllers/SearchController';
import { authenticate } from '../../middleware/verifyJWTToken';
import { RouteConfigType } from '../../types/RouteConfigType';

const searchController = new SearchController();

const searchRoutes: RouteConfigType[] = [
    {
        method: 'get',
        path: '/search/doctors',
        controller: searchController.searchDoctors.bind(searchController),
        middlewares: [],
    },
    {
        method: 'get',
        path: '/search/clinic',
        controller: searchController.searchClinics.bind(searchController),
        middlewares: [],
    }
];

export default searchRoutes;
