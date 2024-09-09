import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
import { fetchRecipes } from '../store/slices/menuSlice';
import { RootState, AppDispatch } from "../store/store";
import "../styles/menuList.css";

interface Recipes {
  id: string;
  name: string;
  image_url: string;
  keyword1: string;
  keyword2: string;
  keyword3: string;
  keyword4: string;
  menu: string;
}

const RecipeList = () => {
  // useDispatch를 사용하되, AppDispatch로 타입 지정
  const dispatch: AppDispatch = useDispatch();

  // useSelector를 사용하되, RootState로 타입 지정
  const { recipes, status, error } = useSelector((state: RootState) => state.menu);

  const [page, setPage] = useState(0);  

  // 컴포넌트가 마운트될 때와 페이지가 변경될 때마다 API 요청
  useEffect(() => {
    dispatch(fetchRecipes({ page }));  
  }, [dispatch, page]);

  // 페이지 변경 함수
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  // API에서 받은 데이터가 객체일 때, content 배열만 추출
  const recipeList = recipes.content || [];  

  return (
    <div className="menu-container">
      {status === 'loading' && <p>Loading...</p>}
      {status === 'failed' && <p>Error: {error}</p>}
      {status === 'succeeded' && Array.isArray(recipeList) && recipeList.length > 0 ? ( 
        <>
          <ul className="menu-list">
            {recipeList.map((recipe: Recipes) => (
              <li className="menu-item" key={recipe.id}>
                <img src={recipe.image_url} className='menu-image' alt={recipe.name} />
                <h2>{recipe.name}</h2>
              </li>
            ))}
          </ul>

          <div className="pagination-container">
          <div className="pagination">
            {Array.from({ length: 8 }, (_, index) => (
              <button
                key={index}
                onClick={() => setPage(index)}
                disabled={page === index}  // 현재 페이지는 비활성화
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
        </>
      ) : (
        status === 'succeeded' && <p>No recipes found</p>
      )}
    </div>
  );
};

export default RecipeList;